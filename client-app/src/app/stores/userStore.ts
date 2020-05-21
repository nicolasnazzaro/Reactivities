import { IUser, IUserFormValues } from "../models/user";
import { observable, computed, action, runInAction } from 'mobx';
import agent from '../api/agent';
import { RootStore } from "./rootStore";
import { history } from '../..';

export default class UserStore {
    rootStore: RootStore;
    
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
    
    @observable user: IUser | null = null;
    
    @computed get isLoggedIn() {return !!this.user}

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;
                this.rootStore.modalStore.modal.open = false;
            });
            this.rootStore.commonStore.setToken(user.token);
            history.push('/activities');
        }
        catch (error) {
            throw error;
        }
    }

    @action getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }

    @action register = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.register(values);
            runInAction(() => {
                this.user = user;
                this.rootStore.commonStore.setToken(user.token);
                this.rootStore.modalStore.modal.open = false;
            });
            history.push('/activities')
        }
        catch (error) {
            throw error;
        }
    }
}