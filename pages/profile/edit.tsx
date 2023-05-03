/* eslint-disable no-void */
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout';
import Button from '@components/button';
import EmailForm from '@/components/form/email-form';
import TokenForm from '@/components/form/token-form';
import ProfileForm from '@/components/form/profile-form';

const EditProfile: NextPage = () => {
  const [isEmailOk, setIsEmailOk] = useState(false);
  const [isTokenOk, setIsTokenOk] = useState(false);

  useEffect(() => {
    if (!isTokenOk) return;
    setIsEmailOk(false);
    setIsTokenOk(false);
  }, [isTokenOk]);

  return (
    <Layout seoTitle="Edit Profile">
      <div className="px-4 py-10">
        <ProfileForm />
        {!isEmailOk && (
          <EmailForm setIsEmailOk={setIsEmailOk}>
            <Button text="Change Email" />
          </EmailForm>
        )}
        {isEmailOk && !isTokenOk && <TokenForm setIsTokenOk={setIsTokenOk} />}
      </div>
    </Layout>
  );
};

export default EditProfile;
