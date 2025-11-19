import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Login from './Login';
import Register from './Register';
import Feed from './Feed';
import CreatePost from './CreatePost';
import MySubscriptions from './MySubscriptions';
import LogWorkout from './LogWorkout';
import WorkoutHistory from './WorkoutHistory';
import ChallengeProof from './ChallengeProof';
import InstructorAnalytics from './InstructorAnalytics';
import Communities from './Communities';
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

function PagesContent() {
    return (
        <Layout>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/" element={<Feed />} />
                
                <Route path="/MySubscriptions" element={<MySubscriptions />} />
                <Route path="/LogWorkout" element={<LogWorkout />} />
                <Route path="/WorkoutHistory" element={<WorkoutHistory />} />
                <Route path="/ChallengeProof" element={<ChallengeProof />} />
                <Route path="/InstructorAnalytics" element={<InstructorAnalytics />} />
                <Route path="/Communities" element={<Communities />} />
                <Route path="/ManageAds" element={<ManageAds />} />
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/PermissionsHelp" element={<PermissionsHelp />} />
                <Route path="/CommunityView" element={<CommunityView />} />
                <Route path="/AccountTypeSelector" element={<AccountTypeSelector />} />
                <Route path="/InstructorPanel" element={<InstructorPanel />} />
                <Route path="/TermsOfService" element={<TermsOfService />} />
                <Route path="/DirectMessages" element={<DirectMessages />} />
                <Route path="/ManageCommunityMembers" element={<ManageCommunityMembers />} />
                <Route path="/EditCommunity" element={<EditCommunity />} />
                <Route path="/InstructorChat" element={<InstructorChat />} />
                <Route path="/CreateWorkoutPlan" element={<CreateWorkoutPlan />} />
                <Route path="/WelcomeScreen" element={<WelcomeScreen />} />
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
