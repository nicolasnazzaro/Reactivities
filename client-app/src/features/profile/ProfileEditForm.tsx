import React, { useContext } from 'react';
import { IProfile } from '../../app/models/profile';
import { Form as FinalForm, Field } from 'react-final-form';
import { observer } from 'mobx-react-lite';
import { combineValidators, isRequired } from 'revalidate';
import { Form, Button } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { RootStoreContext } from '../../app/stores/rootStore';

const validate = combineValidators({
  displayName: isRequired('displayName')
});

interface IProps {
  updateProfile: (profile: Partial<IProfile>) => void;
  profile: IProfile;
}

const ProfileEditForm: React.FC<IProps> = ({updateProfile, profile}) => {
  
  const rootStore = useContext(RootStoreContext);
  const {loading} = rootStore.profileStore;

  return (
    <FinalForm
      onSubmit={updateProfile}
      validate={validate}
      initialValues={profile!}
      render={({handleSubmit, invalid, pristine}) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            name='displayName'
            component={TextInput}
            placeholder='Display Name'
            value={profile!.displayName}
          />
          <Field
            name='bio'
            component={TextAreaInput}
            rows={3}
            placeholder='Bio'
            value={profile!.bio}
          />
          <Button 
            loading={loading}
            floated='right'
            disabled={invalid || pristine}
            color='teal'
            content='Update profile'
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileEditForm);