import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '@/components/common/layout';
import Button from '@/components/common/button/button';
import EmailForm from '@/components/auth/email-form';
import TokenForm from '@/components/auth/token-form';
import ProfileForm from '@/components/profile/profile-form';
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
