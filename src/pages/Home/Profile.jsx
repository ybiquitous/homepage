import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Profile = () => (
  <div className="flex items-center justify-evenly gap-4 sm:gap-8">
    <div className="basis-1/3">
      <img
        className="rounded-full md:w-40"
        src="https://www.gravatar.com/avatar/515b5bb81e946fd400e18de5c4d0763f?s=240"
        alt="Avatar"
      />
    </div>
    <div className="basis-full flex flex-col">
      <h1>
        <strong className="text-xl sm:text-4xl">Masafumi Koba</strong>
      </h1>
      <div className="my-text-secondary sm:text-xl">@ybiquitous</div>
      <p className="mt-4 italic">I’m a Web Programmer. I love Emacs, JavaScript, CSS, and Ruby.</p>
      <small className="mt-1 my-text-secondary inline-flex items-center gap-1">
        <FontAwesomeIcon icon={solid("location-dot")} className="mr-1" />
        Tokyo, Japan
      </small>
    </div>
  </div>
);
