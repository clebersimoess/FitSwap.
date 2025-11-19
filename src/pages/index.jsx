import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Login from './Login';
import Home from './Home';
import CreatePost from './CreatePost (1)';
import MySubscriptions from './MySubscriptions';
import LogWorkout from './LogWorkout';
import WorkoutHistory from './WorkoutHistory';
import ChallengeProof from './ChallengeProof';
import InstructorAnalytics from './InstructorAnalytics (1)';
import Communities from './Communities (1)';
import ManageAds from './ManageAds';
import PrivacyPolicy from './PrivacyPolicy';
import PermissionsHelp from './PermissionsHelp';
import CommunityView from './CommunityView';
import AccountTypeSelector from './AccountTypeSelector';
import InstructorPanel from './InstructorPanel';
import TermsOfService from './TermsOfService';
import DirectMessages from './DirectMessages';
import ManageCommunityMembers from './ManageCommunityMembers';
import EditCommunity from './EditCommunity';
import InstructorChat from './InstructorChat';
import CreateWorkoutPlan from './CreateWorkoutPlan';
import WelcomeScreen from './WelcomeScreen';
import Profile from './Profile';
import Explore from './Explore';
import Notifications from './Notifications';
import Settings from './Settings';

function PagesContent() {
    return (
        <Layout>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/welcome" element={<WelcomeScreen />} />
                <Route path="/account-type" element={<AccountTypeSelector />} />
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/log-workout" element={<LogWorkout />} />
                <Route path="/workout-history" element={<WorkoutHistory />} />
                <Route path="/create-workout-plan" element={<CreateWorkoutPlan />} />
                <Route path="/my-subscriptions" element={<MySubscriptions />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/community/:id" element={<CommunityView />} />
                <Route path="/edit-community" element={<EditCommunity />} />
                <Route path="/manage-members" element={<ManageCommunityMembers />} />
                <Route path="/instructor-panel" element={<InstructorPanel />} />
                <Route path="/instructor-analytics" element={<InstructorAnalytics />} />
                <Route path="/instructor-chat" element={<InstructorChat />} />
                <Route path="/challenge-proof" element={<ChallengeProof />} />
                <Route path="/messages" element={<DirectMessages />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/permissions" element={<PermissionsHelp />} />
                <Route path="/manage-ads" element={<ManageAds />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
