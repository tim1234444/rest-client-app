import dynamic from 'next/dynamic';

const AboutUs = dynamic(() => import('../AboutUsInfo/AboutUsInfo'), {
  loading: () => <p>Loading...</p>,
});

export default function AboutUsContainer() {
  return <AboutUs />;
}
