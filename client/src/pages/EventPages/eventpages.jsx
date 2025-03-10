
import Navbar from "@/components/NavBar/navbar";
import Aurora from "@/components/Aurora/Aurora";
function EventPage(){
    return (
        <>
        <Navbar imglink={''} />
        <div style={{ position: 'relative', minHeight: '110vh', overflow: 'hidden', backgroundColor: 'black',margin:0,paddingTop:120 }}>
          {/* Aurora in the background */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
            <Aurora
              colorStops={["#2c5364", "#2c5364"]}
              blend={1}
              amplitude={0.2}
              speed={0.5}
            />
          </div>
    
          {/* Content on top */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'space-between', // puts space between left & right
              alignItems: 'flex-start',
              height: '100%',
              padding: '100px 200px', // top and sides padding
            }}
          >
            {/* Left side content */}
            <div style={{ color: 'white', maxWidth: '600px' }}>
              <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Events</h1>
              <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                Track your stats, manage entries, and explore events.
              </p>
            </div>
          </div>
        </div>
       
      </>
    );
}

export default EventPage;