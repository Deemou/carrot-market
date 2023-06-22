import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout';
import Button from '@/components/button/button';
import EmailForm from '@/components/form/email-form';
import TokenForm from '@/components/form/token-form';
import ProfileForm from '@/components/form/profile-form';
import { useSession } from 'next-auth/react';

const EditProfile: NextPage = () => {
  const { data: session } = useSession();

  const [email, setEmail] = useState('');
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
          <EmailForm
            disabled={session?.user.provider !== 'credentials'}
            setEmail={setEmail}
            setIsEmailOk={setIsEmailOk}
          >
            <Button text="Change Email" />
          </EmailForm>
        )}
        {isEmailOk && !isTokenOk && (
          <TokenForm email={email} setIsTokenOk={setIsTokenOk} />
        )}
      </div>
    </Layout>
  );
};

export default EditProfile;
