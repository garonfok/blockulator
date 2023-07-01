import { IconBrandGithub } from "@tabler/icons-react";

const Footer = () => {
  return (
    <div className="w-full flex border-t h-16 justify-center">
      <div className="w-[48rem] h-full flex justify-between items-center text-sm text-slate-400">
        <span>&copy; {new Date().getFullYear()} Garon Fok</span>

        <ul className="flex gap-4">
          <li>
            <a href="https://github.com" className="">
              <IconBrandGithub className="h-6" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
