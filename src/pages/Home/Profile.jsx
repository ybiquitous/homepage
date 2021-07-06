import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Profile = () => (
  <div className="flex items-center">
    <img
      className="rounded-full w-32"
      src="https://www.gravatar.com/avatar/515b5bb81e946fd400e18de5c4d0763f?s=240"
      alt="Avatar"
    />
    <div className="ml-2 sm:ml-8">
      <div>
        <strong className="text-xl sm:text-4xl">Masafumi Koba</strong>
      </div>
      <div className="my-text-gray sm:text-xl">ybiquitous</div>
      <div className="mt-4">Web Developer. I love Emacs, JavaScript, CSS, and Ruby.</div>
      <div className="mt-2 my-text-gray text-sm">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
        Tokyo, Japan
      </div>
    </div>
  </div>
);
