import StoryPage from "./StoryPage";

interface PageProps {
  params: { slug: string };
}

export default function Page({ params }: PageProps) {
  return <StoryPage params={Promise.resolve(params)} />;
}