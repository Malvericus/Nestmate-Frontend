// eslint-disable-next-line no-unused-vars
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Lottie from 'react-lottie';
import loadingAnimation from './assets/loadingAnimation.json'; // Update with your Lottie animation path

// Lazy load components
const Dashboard = lazy(() => import('./screens/Dashboard/Dashboard.jsx'));
const UserProfile = lazy(() => import('./screens/UserProfile/UserProfile.jsx'));
const AddSpace = lazy(() => import('./screens/AddSpace/AddSpace.jsx'));
const Discover = lazy(() => import('./screens/Discover/Discover.jsx'));
const Matches = lazy(() => import('./screens/Matches/Matches.jsx'));
const ProfileDetails = lazy(() => import('./screens/ProfileDetails/ProfileDetails.jsx'));
const MessagesList = lazy(() => import('./screens/MessagesList/MessagesList.jsx'));
const ChatConnection = lazy(() => import('./screens/ChatConnection/ChatConnection.jsx'));
const Welcome = lazy(() => import('./screens/Welcome/Welcome.jsx'));
const SignUp = lazy(() => import('./screens/Signup/SignUp.jsx'));
const SignIn = lazy(() => import('./screens/SignIn/SignIn.jsx'));

// Lottie animation options
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const App = () => (
    <>
        <Helmet>
            <title>Nestmate</title>
            <meta name='description'
                  content="Nestmate is your go-to app for finding the perfect roommate. Simplify your search by connecting with like-minded individuals, filtering preferences, and discovering shared living spaces that suit your lifestyle. Whether you're a student, young professional, or just looking for a change, Nestmate makes finding a roommate easy and efficient." />
            <link rel="icon" type="image/svg+xml" href="/assets/HomeIcon.svg" />
        </Helmet>
        <Router>
            <Suspense fallback={
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Lottie options={defaultOptions} height={200} width={200} />
                </div>
            }>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/user" element={<UserProfile />} />
                    <Route path="/add" element={<AddSpace />} />
                    <Route path="/discover" element={<Discover />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/profile/:id" element={<ProfileDetails />} />
                    <Route path="/messages" element={<MessagesList />} />
                    <Route path="/chat/:id" element={<ChatConnection />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/signin" element={<SignIn />} />
                </Routes>
            </Suspense>
        </Router>
    </>
);

export default App;
