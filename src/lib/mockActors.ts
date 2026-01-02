import { Actor } from "./types";

export const mockActors: Actor[] = [
    {
        id: "1",
        name: "Song Joong-ki",
        slug: "song-joong-ki",
        photo: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Song_Joong-ki_at_the_Vincenzo_production_presentation_in_February_2021_%281%29.jpg",
        birthDate: "September 19, 1985",
        birthPlace: "Daejeon, South Korea",
        biography: "Song Joong-ki is a South Korean actor. He rose to fame in the historical coming-of-age drama Sungkyunkwan Scandal (2010) and the variety show Running Man (2010–2011) as one of the original cast members.",
        knownFor: ["1", "10"], // Vincenzo, Descendants of the Sun
    },
    {
        id: "2",
        name: "Hyun Bin",
        slug: "hyun-bin",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Hyun_Bin_in_2018.png/250px-Hyun_Bin_in_2018.png",
        birthDate: "September 25, 1982",
        birthPlace: "Seoul, South Korea",
        biography: "Hyun Bin is a South Korean actor. He gained widespread recognition for his role in the 2005 romantic comedy drama My Name is Kim Sam-soon.",
        knownFor: ["2"], // Crash Landing on You
    },
    {
        id: "3",
        name: "Son Ye-jin",
        slug: "son-ye-jin",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Son_Ye-jin_in_2018.png/250px-Son_Ye-jin_in_2018.png",
        birthDate: "January 11, 1982",
        birthPlace: "Daegu, South Korea",
        biography: "Son Ye-jin is a South Korean actress. She rose to fame in 2003 for The Classic and Summer Scent, which were followed by the commercially successful A Moment to Remember and April Snow.",
        knownFor: ["2"], // Crash Landing on You
    },
    {
        id: "4",
        name: "Kim Seon-ho",
        slug: "kim-seon-ho",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Kim_Seon-ho_in_October_2021.jpg/250px-Kim_Seon-ho_in_October_2021.jpg",
        birthDate: "May 8, 1986",
        birthPlace: "Seoul, South Korea",
        biography: "Kim Seon-ho is a South Korean actor. He began his career on stage and appeared in various plays before making his screen debut in 2017 with Good Manager. He gained prominence with the 2020 television series Start-Up.",
        knownFor: ["6"], // Hometown Cha-Cha-Cha
    },
    {
        id: "5",
        name: "Shin Min-a",
        slug: "shin-min-a",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Shin_Min-a_at_the_Hometown_Cha-Cha-Cha_production_presentation_in_August_2021_%281%29.jpg/250px-Shin_Min-a_at_the_Hometown_Cha-Cha-Cha_production_presentation_in_August_2021_%281%29.jpg",
        birthDate: "April 5, 1984",
        birthPlace: "Seongnam, South Korea",
        biography: "Shin Min-a is a South Korean model and actress. She is best known for starring in television dramas A Love to Kill, My Girlfriend Is a Nine-Tailed Fox, Arang and the Magistrate, Oh My Venus, Tomorrow, with You, and Hometown Cha-Cha-Cha.",
        knownFor: ["6"], // Hometown Cha-Cha-Cha
    },
    {
        id: "6",
        name: "Lee Jung-jae",
        slug: "lee-jung-jae",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Lee_Jung-jae_Cannes_2022.jpg/250px-Lee_Jung-jae_Cannes_2022.jpg",
        birthDate: "December 15, 1972",
        birthPlace: "Seoul, South Korea",
        biography: "Lee Jung-jae is a South Korean actor and filmmaker. He is best known internationally for his role as Seong Gi-hun in the Netflix survival drama Squid Game, for which he received worldwide acclaim.",
        knownFor: ["3"], // Squid Game
    },
    {
        id: "7",
        name: "Kim Soo-hyun",
        slug: "kim-soo-hyun",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Kim_Soo-hyun_in_July_2014.jpg/250px-Kim_Soo-hyun_in_July_2014.jpg",
        birthDate: "February 16, 1988",
        birthPlace: "Seoul, South Korea",
        biography: "Kim Soo-hyun is a South Korean actor. One of the highest-paid actors in South Korea, his accolades include four Baeksang Arts Awards, two Grand Bell Awards and one Blue Dragon Film Award.",
        knownFor: ["11"], // My Love from the Star
    },
    {
        id: "8",
        name: "Jun Ji-hyun",
        slug: "jun-ji-hyun",
        photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Jun_Ji-hyun_at_The_Berlin_File_press_conference.jpg/250px-Jun_Ji-hyun_at_The_Berlin_File_press_conference.jpg",
        birthDate: "October 30, 1981",
        birthPlace: "Seoul, South Korea",
        biography: "Jun Ji-hyun, also known by her English name Gianna Jun, is a South Korean actress and model. She received multiple awards, including two Grand Bell Awards for Best Actress and a Daesang (Grand Prize) for Television at the Baeksang Art Awards.",
        knownFor: ["11", "9"], // My Love from the Star, Kingdom (Ashin)
    }
];
