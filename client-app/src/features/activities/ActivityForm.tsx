import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Form, Button } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import SelectInput from '../../app/common/form/SelectInput';
import { category } from '../../app/common/options/categoryOptions';
import DateInput from '../../app/common/form/DateInput';
import { combineDateAndTime } from '../../app/common/util/util';
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import { v4 as uuid}  from 'uuid';
import { RouteComponentProps } from 'react-router-dom';
import { ActivityFormValues } from '../../app/models/activity';

const validate = combineValidators({
    title: isRequired({message: 'Title is required'}),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'The description needs at least 5 characters'})
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
})

const ActivityForm: React.FC<RouteComponentProps<{id: string}>> = ({match, history}) => {

    const rootStore = useContext(RootStoreContext);
    const {createActivity, loadActivity , editActivity, submitting} = rootStore.activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
          setLoading(true);
          loadActivity(match.params.id)
            .then(activity => {
              setActivity(new ActivityFormValues(activity));
            })
            .finally(() => setLoading(false));
        } else {
            setActivity(new ActivityFormValues());
        }
      }, [loadActivity, match.params.id]);

    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const {date, time, ...activity} = values;
        activity.date = dateAndTime;
        if (!activity.id) {
             let newActivity = {
                 ...activity,
                 id: uuid()
             }
             createActivity(newActivity);
         } else {
             editActivity(activity);
        }
    }

    return (
        <Fragment>
            <FinalForm
                initialValues={activity}
                validate={validate}
                onSubmit={handleFinalFormSubmit}
                render={({handleSubmit, invalid, pristine}) => (
                    <Form onSubmit={handleSubmit} loading={loading}>
                        <Field
                            name='title'
                            placeholder='Title'
                            component={TextInput}
                        />
                        <Field
                            name='description'
                            placeholder='Description'
                            rows={3}
                            component={TextAreaInput}
                        />
                        <Field
                            name='category'
                            placeholder='Category'
                            component={SelectInput}
                            options={category}
                        />
                        <Form.Group widths='equal'>
                            <Field
                                name='date'
                                placeholder='Date'
                                date={true}
                                component={DateInput}
                            />
                            <Field
                                name='time'
                                placeholder='Time'
                                time={true}
                                component={DateInput}
                            />
                        </Form.Group>
                        <Field
                            name='city'
                            placeholder='City'
                            component={TextInput}
                        />
                        <Field
                            name='venue'
                            placeholder='Venue'
                            component={TextInput}
                        />
                        <Button
                            disabled={pristine || invalid}
                            loading={submitting}
                            floated='right'
                            color='teal'
                            type='submit'
                            content='Submit'
                        />
                        <Button
                            onClick={
                                activity.id
                                  ? () => history.push(`/activities/${activity.id}`)
                                  : () => history.push('/activities')
                              }
                            floated='right'
                            type='button'
                            content='Cancel'
                        />
                    </Form>
                )}
            />
        </Fragment>
    )
}

export default observer(ActivityForm);