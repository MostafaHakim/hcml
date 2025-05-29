import Nav from "../components/Nav";

function Home() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start pt-40">
      <div className="w-full h-32 flex flex-col items-center justify-center">
        <Nav />
      </div>
    </div>
  );
}

export default Home;
