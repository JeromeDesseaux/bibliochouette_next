import Link from "next/link";
import { HeroWrapper } from "~/components/landing/hero";
import { Button } from "~/components/ui/button";


const Home = () => {
  return (
    <HeroWrapper>
      <h1 className="text-2xl">La solution de gestion de Bibliothèque simple et rapide !</h1>
      <p>La fin des livres perdus. Gérez les emprunts de vos ouvrages simplement.</p>
      <Link href="/auth/login">
        <Button>Essayer gratuitement</Button>
      </Link>
    </HeroWrapper>
  );
}

export default Home;
