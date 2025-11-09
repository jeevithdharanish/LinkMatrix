// This component's only job is to render the page.
// The {children} prop is your 'page.js' file.
export default function PublicPageLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}