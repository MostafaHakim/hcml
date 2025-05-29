import { NavLink } from "react-router-dom";

function Topbar({ setTabOption }) {
  const tabOption = [...setTabOption];
  return (
    <div className="w-full flex flex-row items-start justify-center py-2 px-4">
      <ul className="flex flex-row uppercase  bg-black bg-opacity-30  rounded-full overflow-hidden">
        {tabOption.map((item, i) => {
          return (
            <NavLink
              to={item}
              className="px-8 py-2 hover:bg-white hover:bg-opacity-10 transition duration-300"
            >
              {item}
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
}

export default Topbar;
