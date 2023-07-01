import { IconBrandGithub } from "@tabler/icons-react";

const Header = () => {
  return (
    <nav className="w-full flex border-b h-16 justify-center">
      <div className="w-[48rem] h-full flex justify-between items-center">
        <a href="/" className="select-none text-2xl text-sky-500 font-bold">Blockulator</a>
        <ul className="text-slate-600 flex gap-4">
          <li>
            <a href="https://github.com/garonfok" className="">
              <IconBrandGithub className="hover:text-sky-300" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
