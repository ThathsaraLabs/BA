import { sitePath } from "../site-path";

export default function TravelPage() {
  const destination = sitePath("/#travel");
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      <main><a href={destination}>Open the Travel Guide</a></main>
    </>
  );
}
