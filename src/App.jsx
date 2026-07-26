import Header from "./components/Header";
import GlowCursor from "./components/GlowCursor";
import Hero from "./sections/Hero";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

function App() {
  return (
    <>
      <Header />
      <GlowCursor />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default App;