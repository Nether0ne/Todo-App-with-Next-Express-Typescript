import { LoginForm } from "@components/forms/auth/Login";
import { RegisterForm } from "@components/forms/auth/Register";
import { AuthLayout } from "@components/layout/Auth";
import initAxios from "@queries/client";
import getCurrentUser from "@queries/user/getCurrentUser";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { SyntheticEvent, useState } from "react";

const AuthPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const switchTabEvent = (
    _event: SyntheticEvent<Element, Event>,
    value: string,
  ) => setActiveTab(value);

  return (
    <>
      <Head>
        <title>Auth</title>
        <meta name="auth page" content="auth page of the application" />
      </Head>
      <main>
        <AuthLayout>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                variant="fullWidth"
                onChange={switchTabEvent}
                aria-label="auth tabs">
                <Tab label="Login" value="1" />
                <Tab label="Register" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <LoginForm />
            </TabPanel>
            <TabPanel value="2">
              <RegisterForm />
            </TabPanel>
          </TabContext>
        </AuthLayout>
      </main>
    </>
  );
};

export default AuthPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const client = initAxios(req);
  const user = await getCurrentUser(client);

  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return { props: {} };
};
