/**
 * @param {{children: JSX.Element}} props
 */
export const Header = ({ children }) => (
  <header>
    <h1 className="font-sans font-semibold text-5xl">
      <a href="/">@ybiquitous</a>
    </h1>
    {children}
  </header>
);
