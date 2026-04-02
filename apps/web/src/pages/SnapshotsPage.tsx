import HeaderInfoPage from './HeaderInfoPage';

export default function SnapshotsPage() {
  return (
    <HeaderInfoPage
      title="Snapshots"
      subtitle="A quick glance dashboard for platform health, market movement, and user activity trends."
      snapshots={[
        { title: 'Active Markets', value: '318', note: 'Live across asset classes' },
        { title: 'Users Online', value: '24.1K', note: 'Current concurrent sessions' },
        { title: 'System Uptime', value: '99.9%', note: 'Rolling 30-day service level' },
      ]}
      faqs={[
        {
          question: 'What are snapshots used for?',
          answer: 'Snapshots present high-signal metrics so you can understand current platform and market conditions quickly.',
        },
        {
          question: 'Do snapshots replace full analytics pages?',
          answer: 'No. They provide a summary view, while detailed analytics are available in dedicated modules.',
        },
        {
          question: 'Can I use snapshots before logging in?',
          answer: 'Yes. Public snapshot views are accessible from landing navigation for quick discovery.',
        },
      ]}
    />
  );
}