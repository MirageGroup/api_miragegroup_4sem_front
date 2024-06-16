import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const nav = useNavigate();
  const location = useLocation();

  function handleLogoutSidebar() {
    const confirm = window.confirm("Tem certeza que deseja sair?");
    if (confirm) {
      nav("/logout");
    } else {
      return;
    }
  }

  const { user } = useAuth();

  const links = [
    {
      name: "Home",
      icon: "/home_logo.svg",
      link: "/dashboard",
    },
    {
      name: "Salas",
      icon: "/room.svg",
      link: "/newRoom",
      subRoutes: ["/createRoom"]
    },
    {
      name: "Reuniões",
      icon: "/meeting.svg",
      link: "/meetings",
      subRoutes: ["/createMeeting", "/updateMeeting/:meetingId"]
    },
    {
      name: "Usuários",
      icon: "/user.svg",
      link: "/users",
      subRoutes: ["/addUser"]
    },
  ];

  const isActiveLink = (link) => {
    if (location.pathname === link.link) {
      return true;
    }

    if (link.subRoutes) {
      return link.subRoutes.some((subRoute) => {
        const regex = new RegExp(`^${subRoute.replace(/:\w+/g, '\\w+')}$`);
        return regex.test(location.pathname);
      });
    }

    return false;
  };

  return (
    <div className="h-16 w-full lg:h-screen lg:min-w-[15rem] lg:max-w-[15rem] sticky top-0 bg-[#262932] lg:w-sidebar-width border-r border-sidebar-border flex lg:flex-col justify-between items-center lg:py-6">
      <div className="lg:w-full w-[80%] flex lg:flex-col justify-between items-center lg:items-start lg:py-6">
        <div className="hidden lg:flex justify-center items-center py-6 w-full">
          <img src="/orca_logo.svg" alt="" className="h-20 w-[112px]" />
        </div>
        <div className="flex lg:flex-col justify-center lg:justify-start items-center px-2 lg:px-6 lg:gap-8 w-full">
          {links.map((link) => {
            const isActive = isActiveLink(link);

            if (link.name === 'Usuários' && user.role === 'admin') {
              return (
                <Link
                  key={link.name}
                  to={link.link}
                  className={`w-full flex justify-center lg:justify-start items-center lg:py-4 transition easy-in-out ${isActive ? 'lg:bg-[#FED353] text-white' : 'hover:bg-[#575757] text-[#FED353] lg:text-[#FEFEFE] hover:text-white'
                    } rounded-lg relative`}
                >
                  {isActive && <span className="hidden lg:block lg:absolute lg:left-0 lg:top-0 bottom-0 lg:w-1 bg-[#FED353] rounded-r-lg lg:ml-[-22px]"></span>}
                  <div className="flex items-center gap-4 px-4 lg:px-8">
                    <img src={link.icon} alt="" className="h-6 hidden lg:block" />
                    <p className="text-sm lg:text-base">{link.name}</p>
                  </div>
                </Link>
              );
            }

            if (link.name !== 'Usuários') {
              return (
                <Link
                  key={link.name}
                  to={link.link}
                  className={`w-full flex justify-center lg:justify-start items-center lg:py-4 transition easy-in-out ${isActive ? 'lg:bg-[#FED353] text-white' : 'hover:bg-[#575757] text-[#FED353] lg:text-[#FEFEFE] hover:text-white'
                    } rounded-lg relative`}
                >
                  {isActive && <span className="hidden lg:block lg:absolute lg:left-0 lg:top-0 bottom-0 lg:w-1 bg-[#FED353] rounded-r-lg lg:ml-[-22px]"></span>}
                  <div className="flex items-center gap-4 px-4 lg:px-8">
                    <img src={link.icon} alt="" className="h-6 hidden lg:block" />
                    <p className="text-sm lg:text-base">{link.name}</p>
                  </div>
                </Link>
              );
            }

            return null;
          })}
        </div>
      </div>

      <div className="lg:w-full w-[20%] flex justify-center">
        <button type="button" className="flex text-[#FEFEFE] lg:w-42 gap-4 p-4 hover:bg-[#575757] rounded-lg justify-center lg:justify-center lg:items-center" onClick={handleLogoutSidebar}>
          <div className="w-6 flex justify-center lg:justify-start">
            <img src="/logout.svg" alt="Logout" />
          </div>  
          <label className="cursor-pointer hidden lg:block">Sair da conta</label>
        </button>
      </div>
    </div>
  );
}
