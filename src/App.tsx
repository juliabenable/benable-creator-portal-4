import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CreatorProvider } from '@/context/CreatorContext';
import Layout from '@/pages/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ApplyPage from '@/pages/ApplyPage';
import CampaignPage from '@/pages/CampaignPage';
import CampaignsListPage from '@/pages/CampaignsListPage';
import ProfilePage from '@/pages/ProfilePage';

function App() {
  return (
    <CreatorProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/campaigns" element={<CampaignsListPage />} />
            <Route path="/campaign/:id" element={<CampaignPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CreatorProvider>
  );
}

export default App;
