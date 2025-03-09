import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BilingualText from "../components/BilingualText";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <Header />
      <BilingualText />
    </div>
  );
};

export default HomePage;