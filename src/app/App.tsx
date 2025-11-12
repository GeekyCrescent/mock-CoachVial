import AboutUs from "../sections/AboutUs";
import Flotillas from "../sections/Flotillas";
import Services from "../sections/Services";
import Layout from "./layout";

export default function App() {
  return (
    <Layout>
          <AboutUs />
          <Services />
          <Flotillas />
    </Layout>
  );
}
