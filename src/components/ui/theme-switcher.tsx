import { useTheme } from "next-themes";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
    const { setTheme } = useTheme()
    const [light, setLight] = useState(true);

    const handleToggleTheme = () => {
        const theme = light ? "dark" : "light";
        setTheme(theme);
    };

    useEffect(() => {
        handleToggleTheme();
    }, [light]);

    return (
        <Button variant="outline" size="icon" onClick={() => setLight(!light)}>
            {
                light ?
                    <Sun className="h-[1.2rem] w-[1.2rem] transition-all text-white" />
                    :
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all text-black" />
            }
        </Button>
    );
}

export default ThemeSwitcher;