import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed, reaction, toJS } from "mobx";
import { IActivity, IAttendee } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const LIMIT = 2;

export default class ActivityStore {
    rootStore: RootStore;
    
    constructor(rootStore: RootStore){
        this.rootStore = rootStore

        reaction(
            () => this.predicate.keys(),
            () => {
                this.page = 0;
                this.activityRegistry.clear();
                this.loadActivities();
            }
        )
    }

    @observable loadingInitial = false;
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable submitting = false;
    @observable loading = false;
    @observable.ref hubConnection: HubConnection | null = null;
    @observable activityCount = 0;
    @observable page = 0;
    @observable predicate = new Map();

    @computed get axiosParams() {
        const params =  new URLSearchParams();
        params.append('limit', LIMIT.toString());
        params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
        if (!this.predicate.has('startDate')) {
            params.append('startDate', new Date().toISOString());
        }
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, value.toISOString())
            } else {
                params.append(key, value);
            }
        });
        return params;
    }

    @computed get totalPages() {
        return Math.ceil(this.activityCount/LIMIT)
    }

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    @action setPage = (page: number) => {
        this.page = page;
    }

    @action setPredicate = (predicate: string, value: string | Date) => {
        this.predicate.clear();
        if (predicate !== 'all') {
            this.predicate.set(predicate, value);
        }
    }

    @action createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
                accessTokenFactory: () => this.rootStore.commonStore.token!
            })
            .configureLogging(LogLevel.Information).build();

        this.hubConnection
            .start()
            .then(() => console.log(this.hubConnection!.state))
            .then(() => {console.log('Attempting to join group');
                if (this.hubConnection!.state === 'Connected'){
                    this.hubConnection!.invoke('AddToGroup', activityId)
                }
            })
            .catch((error) => console.log('Error establishing connection: ', error));

        this.hubConnection.on('ReceiveComment', comment => {
            runInAction(() => {
              this.activity!.comments.push(comment);
            });
        });

        this.hubConnection.on('Send', message => {
            console.log(message);
        });
    }

    @action stopHubConnection = () => {
        this.hubConnection!.invoke('RemoveFromGroup', this.activity!.id)
        .then(() => {
            this.hubConnection!.stop();
        })
        .then(() => console.log('Connection stopped'))
        .catch(err => console.log(err));
    }

    @action addComment = async (values: any) => {
        values.activityId = this.activity!.id;
        try {
          await this.hubConnection!.invoke('SendComment', values)
        } catch (error) {
          console.log(error);
        }
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        const user = this.rootStore.userStore.user!;
        try {
            const activitiesEnvelop = await agent.Activities.list(this.axiosParams);
            const {activities, activityCount} = activitiesEnvelop;
            runInAction(() => {
                activities.forEach((activity) => {
                    activity.date = new Date(activity.date!);
                    activity.isGoing = activity.attendees.some(
                        a => a.username === user.username
                    );
                    activity.isHost = activity.attendees.some(
                        a => a.username === user.username && a.isHost
                    );
                    this.activityRegistry.set(activity.id, activity);
                    this.activityCount = activityCount;
                    this.loadingInitial = false;
                });
            }); 
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingInitial = false;
            });
        }
    }

    @action loadActivity = async (id: string) => {
        let activity: IActivity = this.activityRegistry.get(id);
        const user = this.rootStore.userStore.user!;
        if (activity) {
            this.activity = activity;
            return toJS(activity);
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    activity.date = new Date(activity.date!)
                    activity.isGoing = activity.attendees.some(
                        a => a.username === user.username
                    );
                    activity.isHost = activity.attendees.some(
                        a => a.username === user.username && a.isHost
                    );
                    this.activity = activity;
                    this.loadingInitial = false;
                });
                return activity;
            } catch (error) {
                console.log(error);
                runInAction(() => {
                    this.loadingInitial = false;
                });
            }
        }
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            const user = this.rootStore.userStore.user!;
            const attendee: IAttendee = {
                username: user.username,
                displayName: user.displayName,
                isHost: true,
                image: user.image!
            }
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.comments = [];
            activity.isHost = true; 
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`);
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.submitting = false;
            });
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
          await agent.Activities.update(activity);
          runInAction(() => {
            this.activityRegistry.set(activity.id, activity);
            this.activity = activity;
            this.submitting = false;
          });
          history.push(`/activities/${activity.id}`);
        } catch (error) {
          runInAction(() => {
            this.submitting = false;
          });
          console.log(error);
        }
      };

    @action deleteActivity = async (id: string) => {
        this.submitting = true;
        try{
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
            });
            history.push('/activities');
        }
        catch (error) {
            console.log(error);
            runInAction(() => {
                this.submitting = false;
            });
        }
    }

    @action attendActivity = async () => {
        const user = this.rootStore.userStore.user!;
        const attendee: IAttendee = {
            username: user.username,
            displayName: user.displayName,
            isHost: false,
            image: user.image!
        }
        this.loading = true;
        try {
            await agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                this.activity!.attendees.push(attendee)
                this.activity!.isGoing = true;
                this.activityRegistry.set(this.activity!.id, this.activity!);
                this.loading = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problems signing up to the activity');    
        }
    }

    @action cancelAttendance = async () => {
        try {
            this.loading = true;
            await agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                this.activity!.attendees = this.activity!.attendees.filter(
                    a => a.username !== this.rootStore.userStore.user!.username
                );
                this.activity!.isGoing = false;
                this.activityRegistry.set(this.activity!.id, this.activity!);
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problems cancelling attendace');
        }
    }
}