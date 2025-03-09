function Sidebar({ isOpen, toggleSidebar }) {
    return (
      <>
        {/* Backdrop when sidebar is open */}
        {isOpen && (
          <div
            onClick={toggleSidebar}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998,
            }}
          />
        )}
  
        {/* Sidebar */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: isOpen ? 0 : '-300px',
            height: '100%',
            width: '250px',
            backgroundColor: '#0D0D0D',
            borderRight: '2px solid #00f0ff',
            transition: 'left 0.3s ease',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '80px',
          }}
        >
          <a
            href="#"
            style={{
              color: '#00f0ff',
              textDecoration: 'none',
              padding: '10px 20px',
              fontSize: '18px',
            }}
          >
            Home
          </a>
          <a
            href="#"
            style={{
              color: '#00f0ff',
              textDecoration: 'none',
              padding: '10px 20px',
              fontSize: '18px',
            }}
          >
            Settings
          </a>
        </div>
      </>
    );
  }
  
  export default Sidebar;
  