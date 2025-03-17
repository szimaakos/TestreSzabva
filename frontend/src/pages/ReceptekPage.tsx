import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReceptekPage.css";
import avokadoPiritos from "../images/avokadoPiritos.jpeg";
import avokadosCsicseriSalata from "../images/avokadosCsicseriSalata.jpeg";
import bananosProteinMuffin from "../images/bananosProteinMuffin.jpeg";
import bananosSmoothie from "../images/bananosSmoothie.jpg";
import bananosZabkasa from "../images/bananosZabkasa.jpeg";
import bogyosGyumiSmoothie from "../images/bogyosGyumiSmoothie.jpeg";
import csicseriBorsoCurry from "../images/csicseriborsoCurry.jpeg";
import csirkeCeaserSalataEgeszseges from "../images/csirkeCaesarSalataEgeszseges.jpeg";
import csirkequinoasalataval from "../images/csirkequinoasalataval.jpeg";
import csirkeWrap from "../images/csirkeWrap.jpeg";
import edesburgonyBuddhaBowl from "../images/edesburgonyaBuddhaBowl.jpeg";
import edesburgonyaSalata from "../images/edesburgonyaSalata.jpeg";
import gorogJoghurtParafait from "../images/gorogJoghurtParfait.jpg";
import gorogSalataCsirke from "../images/gorogSalataCsirke.jpeg";
import haziProtein from "../images/haziProteinSzelet.jpeg";
import lencseLeves from "../images/lencseLeves.jpeg";
import mandulaGyumolcs from "../images/mandulaGyumolcsSali.jpeg";
import marhahusosSalata from "../images/marhahusosSalata.jpeg";
import mediterranCsicseriSalata from "../images/mediterranCsicseriSalata.jpeg";
import mediterranTofuBowl from "../images/mediterranTofuBowl.jpeg";
import proteinPalacsinta from "../images/proteinPalacsinta.jpeg";
import proteinZabkasa from "../images/proteinZabkasa.jpg";
import bowlZoldseg from "../images/quinoaBowlZoldseg.jpg";
import ZoldsegBurger from "../images/quinoaZoldsegBurger.jpeg";
import quionaBabSalata from "../images/quionaBabSalata.jpeg";
import rakosAvokadoSalata from "../images/rakosAvokadoSalata.jpeg";
import spenotosFetaOmlett from "../images/spenotosFetaOmlett.jpeg";
import spenotosTortilla from "../images/spenotosTortilla.jpeg";
import sultCsirkeBrokoliStirfry from "../images/sultCsirkeBrokkoliStirfry.jpeg";
import sultLazacZoldseg from "../images/sultLazacZoldseg.jpeg";
import sultPulykaZoldsegMix from "../images/sultPulykaZoldsegMix.jpg";
import sultTonhalAvokadoSalata from "../images/sultTonhalAvokadoSalata.jpeg";
import teljesKiorlesTesztaZoldseg from "../images/teljesKiorlesTesztaZoldseg.jpeg";
import tofuRantotta from "../images/tofuRantotta.jpeg";
import toltottPapper from "../images/toltottPapper.jpg";
import tonhalSalata from "../images/tonhalSalata.jpeg";
import veganZoldTal from "../images/veganZoldTal.jpeg";
import zoldsegesTofuStirfry from "../images/zoldsegesTofuStirfry.jpeg";
import zoldsegSpaghetti from "../images/zoldsegSpaghetti.jpeg";
import zoldturmix from "../images/zoldturmix.jpeg";

interface Recipe {
  id: number;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

const recipesData: Recipe[] = [
  {
    id: 1,
    title: "Csirke Quinoa Saláta",
    image: csirkequinoasalataval,
    description:
      "Tápláló és könnyű recept, ideális az izomépítéshez és regenerációhoz.",
    ingredients: [
      "150g csirkemell",
      "100g quinoa",
      "Vegyes zöldségek (paradicsom, uborka, paprika)",
      "Olívaolaj",
      "Citromlé",
      "Só, bors, fűszerek"
    ],
    instructions: [
      "Grillezd meg a csirkemellet, majd szeleteld fel.",
      "Főzd meg a quinoát a csomagolás utasítása szerint.",
      "Vágd apróra a zöldségeket és keverd össze az olívaolajjal, citromlével, sóval és borssal.",
      "Tálald a csirkét a quinoa és a saláta tetején."
    ]
  },
  {
    id: 2,
    title: "Zöld Turmix",
    image: zoldturmix,
    description:
      "Frissítő, vitaminokban gazdag smoothie az immunrendszer támogatására.",
    ingredients: [
      "Egy marék spenót",
      "1 érett banán",
      "1 alma",
      "Fél citrom leve",
      "200ml mandulatej vagy víz"
    ],
    instructions: [
      "Hámozd meg a banánt és az almát, majd darabold fel.",
      "Tedd a spenótot, banánt, almát és citromlevet a turmixgépbe.",
      "Öntsd fel mandulatejjel vagy vízzel, majd turmixold simára.",
      "Azonnal tálald, hogy megőrizze a vitaminokat."
    ]
  },
  {
    id: 3,
    title: "Sült Lazac és Zöldségek",
    image: sultLazacZoldseg,
    description:
      "Omega-3-ban gazdag lazac sült zöldségekkel, ideális egy egészséges étkezéshez.",
    ingredients: [
      "200g lazacfilé",
      "Brokkoli, sárgarépa, cukkini",
      "Olívaolaj",
      "Fűszerek (rozmaring, só, bors)",
      "Citromszeletek"
    ],
    instructions: [
      "Melegítsd elő a sütőt 200°C-ra.",
      "Locsold meg a lazacot és a zöldségeket olívaolajjal, majd szórd meg a fűszerekkel.",
      "Süsd a lazacot 15-20 percig, a zöldségeket pár perccel rövidebb ideig.",
      "Tálald citromszeletekkel és friss fűszerekkel."
    ]
  },
  {
    id: 4,
    title: "Teljes Kiőrlésű Tészta Zöldségekkel",
    image: teljesKiorlesTesztaZoldseg,
    description:
      "Rostban gazdag recept, amely energiával tölt fel és támogatja az egészséges életmódot.",
    ingredients: [
      "200g teljes kiőrlésű tészta",
      "Friss paradicsom, spenót, fokhagyma",
      "Olívaolaj",
      "Bazsalikom",
      "Só, bors"
    ],
    instructions: [
      "Főzd meg a tésztát a csomagolás utasítása szerint.",
      "Párold meg a fokhagymát olívaolajon, add hozzá a paradicsomot és spenótot.",
      "Keverd össze a főtt tésztával, majd szórd meg bazsalikommal, sóval és borssal.",
      "Tálald azonnal, hogy a zöldségek frissessége megmaradjon."
    ]
  },
  {
    id: 5,
    title: "Avokádós Pirítós",
    image: avokadoPiritos,
    description:
      "Egyszerű, mégis ízletes reggeli, ami feltölt energiával és egészséges zsírokkal.",
    ingredients: [
      "2 szelet teljes kiőrlésű kenyér",
      "1 érett avokádó",
      "Só, bors, citromlé",
      "Fűszerpaprika"
    ],
    instructions: [
      "Pirítsd meg a kenyérszeleteket.",
      "Hémozd meg és karikázd fel az avokádót, majd kend a kenyérre.",
      "Locsold meg egy kevés citromlével, szórd meg sóval, borssal és fűszerpaprikával.",
      "Azonnal fogyasztható."
    ]
  },
  {
    id: 6,
    title: "Bogyós Gyümölcs Smoothie Bowl",
    image: bogyosGyumiSmoothie,
    description:
      "Frissítő és energizáló smoothie bowl, tele vitaminokkal és rostokkal.",
    ingredients: [
      "1 banán",
      "150g vegyes bogyós gyümölcs",
      "100ml joghurt",
      "20g zabpehely",
      "Egy kevés méz",
      "Friss menta a díszítéshez"
    ],
    instructions: [
      "Turmixold össze a banánt, bogyós gyümölcsöket és a joghurtot.",
      "Öntsd tálba, szórd meg zabpehellyel és locsold meg egy kevés mézzel.",
      "Díszítsd friss mentával.",
      "Azonnal tálald."
    ]
  },
  {
    id: 7,
    title: "Protein Zabkása",
    image: proteinZabkasa,
    description: "Energia- és fehérjefokozó reggeli, mely segít a nap indításában.",
    ingredients: [
      "50g zabpehely",
      "200ml mandulatej",
      "1 kanál proteinpor",
      "1 banán",
      "Egy marék dió vagy mandula",
      "Méz vagy juharszirup ízlés szerint"
    ],
    instructions: [
      "Forrald fel a mandulatejet, majd add hozzá a zabpelyhet és főzd, amíg besűrűsödik.",
      "Keverd bele a proteinport, majd szeleteld fel a banánt.",
      "Tálald dióval és egy kis mézzel vagy juharsziruppal."
    ]
  },
  {
    id: 8,
    title: "Zöldséges Tofu Stir-fry",
    image: zoldsegesTofuStirfry,
    description: "Egészséges és gyors étel tofuval és friss zöldségekkel.",
    ingredients: [
      "200g tofu, kockára vágva",
      "Brokkoli, paprika, sárgarépa",
      "2 evőkanál szójaszósz",
      "1 evőkanál szezámolaj",
      "Gyömbér és fokhagyma ízlés szerint"
    ],
    instructions: [
      "Pirítsd a tofu kockákat szezámolajon.",
      "Add hozzá a felaprított zöldségeket, fokhagymát és gyömbért, párold pár percig.",
      "Öntsd rá a szójaszószt, keverd össze."
    ]
  },
  {
    id: 9,
    title: "Spenótos Feta Omlett",
    image: spenotosFetaOmlett,
    description: "Magas fehérjetartalmú omlett friss spenóttal és feta sajttal.",
    ingredients: [
      "3 tojás",
      "Egy marék friss spenót",
      "50g feta sajt",
      "Só, bors",
      "Egy kis olívaolaj"
    ],
    instructions: [
      "Verd fel a tojásokat, majd add hozzá a spenótot és fetát.",
      "Önts egy serpenyőbe és süsd aranybarnára."
    ]
  },
  {
    id: 10,
    title: "Marhahúsos Saláta",
    image: marhahusosSalata,
    description: "Fehérjedús saláta sült marhahússal és friss zöldségekkel.",
    ingredients: [
      "150g sovány marhahús",
      "Vegyes zöldsaláta",
      "Paradicsom, uborka, lilahagyma",
      "Olívaolaj, balzsamecet",
      "Só, bors"
    ],
    instructions: [
      "Grillezd vagy süsd meg a húst, szeleteld fel.",
      "Keverd össze a zöldségeket, locsold meg és tálald."
    ]
  },
  {
    id: 11,
    title: "Csicseriborsó Curry",
    image: csicseriBorsoCurry,
    description: "Fűszeres csicseriborsó curry, feltölt energiával.",
    ingredients: [
      "400g csicseriborsó",
      "1 hagyma",
      "2 gerezd fokhagyma",
      "1 doboz kókusztej",
      "Curry fűszerkeverék",
      "Koriander, só, bors"
    ],
    instructions: [
      "Pirítsd meg a hagymát és fokhagymát.",
      "Add hozzá a csicseriborsót és curry-t.",
      "Öntsd rá a kókusztejet, főzd 10-15 percig."
    ]
  },
  {
    id: 12,
    title: "Quinoa Bowl Zöldségekkel",
    image: bowlZoldseg,
    description: "Tápláló tál quinoa és friss zöldségekkel.",
    ingredients: [
      "100g quinoa",
      "Vegyes zöldségek (spenót, paradicsom, avokádó)",
      "Olívaolaj, citromlé",
      "Só, bors"
    ],
    instructions: [
      "Főzd meg a quinoát.",
      "Keverd össze a zöldségeket, locsold meg."
    ]
  },
  {
    id: 13,
    title: "Avokádós Csicseriborsó Saláta",
    image: avokadosCsicseriSalata,
    description: "Könnyű saláta avokádóval és csicseriborsóval.",
    ingredients: [
      "1 érett avokádó",
      "400g csicseriborsó",
      "Paradicsom, uborka",
      "Olívaolaj, citromlé, só, bors"
    ],
    instructions: [
      "Vágd kockára az avokádót és zöldségeket.",
      "Keverd össze a csicseriborsóval, locsold meg."
    ]
  },
  {
    id: 14,
    title: "Édesburgonya Saláta",
    image: edesburgonyaSalata,
    description: "Saláta sült édesburgonyával és friss zöldségekkel.",
    ingredients: [
      "2 édesburgonya",
      "Kelj fodor vagy spenót",
      "Piros hagyma, paprika",
      "Olívaolaj, balzsamecet, só, bors"
    ],
    instructions: [
      "Süsd meg a burgonyát 200°C-on.",
      "Keverd össze a hozzávalókat, locsold meg."
    ]
  },
  {
    id: 15,
    title: "Tonhal Saláta",
    image: tonhalSalata,
    description: "Saláta tonhallal és friss zöldségekkel.",
    ingredients: [
      "1 doboz tonhal",
      "Salátalevelek, paradicsom, uborka, olívabogyó",
      "Olívaolaj, citromlé, só, bors"
    ],
    instructions: [
      "Öblítsd le a tonhalat, keverd össze a salátát, locsold meg."
    ]
  },
  {
    id: 16,
    title: "Protein Palacsinta",
    image: proteinPalacsinta,
    description: "Palacsinta magas fehérjetartalommal, ideális edzés után.",
    ingredients: [
      "2 tojás",
      "30g zabpehely",
      "1 banán",
      "1 kanál proteinpor",
      "Fahéj"
    ],
    instructions: [
      "Turmixold össze a hozzávalókat, süsd aranybarnára, tálald."
    ]
  },
  {
    id: 17,
    title: "Banános Zabkása",
    image: bananosZabkasa,
    description: "Egyszerű zabkása banánnal és chia maggal.",
    ingredients: [
      "50g zabpehely",
      "200ml víz vagy mandulatej",
      "1 banán",
      "1 evőkanál chia mag",
      "Méz"
    ],
    instructions: [
      "Főzd meg a zabpelyhet, keverd össze a banánnal és chia-val, édesítsd."
    ]
  },
  {
    id: 18,
    title: "Görög Joghurt Parfait",
    image: gorogJoghurtParafait,
    description: "Rétegezett desszert vagy reggeli, tele fehérjével és rostokkal.",
    ingredients: [
      "200g görög joghurt",
      "50g granola",
      "Vegyes bogyós gyümölcsök",
      "Méz"
    ],
    instructions: [
      "Rétegezd a hozzávalókat egy pohárban, locsold meg."
    ]
  },
  {
    id: 19,
    title: "Csirke Wrap Teljes Kiőrlésű Tortillával",
    image: csirkeWrap,
    description: "Wrap csirkével és friss zöldségekkel.",
    ingredients: [
      "150g csirkemell",
      "Teljes kiőrlésű tortilla",
      "Saláta, paradicsom, avokádó",
      "Joghurtszósz"
    ],
    instructions: [
      "Szeleteld fel a csirkét, töltsd meg a tortillát, tekerd fel."
    ]
  },
  {
    id: 20,
    title: "Mandulavaj Banános Smoothie",
    image: bananosSmoothie,
    description: "Smoothie mandulavajjal és spenóttal, edzés előtt vagy után.",
    ingredients: [
      "1 banán",
      "1 evőkanál mandulavaj",
      "200ml mandulatej",
      "Spenót, jég"
    ],
    instructions: [
      "Turmixold össze a hozzávalókat, öntsd pohárba."
    ]
  },
  {
    id: 21,
    title: "Töltött Paprika",
    image: toltottPapper,
    description: "Paprika pulykahússal és barna rizzsel töltve.",
    ingredients: [
      "4 paprika",
      "200g darált pulyka",
      "50g barna rizs",
      "1 paradicsom",
      "Fűszerek"
    ],
    instructions: [
      "Főzd meg a rizst, keverd össze a húst, töltsd meg a paprikákat, süsd."
    ]
  },
  {
    id: 22,
    title: "Sült Pulyka és Zöldség Mix",
    image: sultPulykaZoldsegMix,
    description: "Pulyka és zöldségek egy könnyű ételben.",
    ingredients: [
      "200g pulyka",
      "Brokkoli, sárgarépa, cukkini",
      "Olívaolaj, fűszerek"
    ],
    instructions: [
      "Süsd meg a pulykát, párold meg a zöldségeket, tálald."
    ]
  },
  {
    id: 23,
    title: "Görög Saláta Csirke Hozzáadásával",
    image: gorogSalataCsirke,
    description: "Grillezett csirkével dúsított görög saláta.",
    ingredients: [
      "Saláta, paradicsom, uborka, feta",
      "Olívabogyó, vörös hagyma",
      "150g csirke"
    ],
    instructions: [
      "Keverd össze a hozzávalókat, tálald a csirkét a tetején."
    ]
  },
  {
    id: 24,
    title: "Mediterrán Csicseriborsó Saláta",
    image: mediterranCsicseriSalata,
    description: "Saláta csicseriborsóval, zöldségekkel és mediterrán fűszerekkel.",
    ingredients: [
      "400g csicseriborsó",
      "Paradicsom, uborka, vörös hagyma",
      "Feta, olívaolaj, citromlé",
      "Só, bors, oregánó"
    ],
    instructions: [
      "Keverd össze a hozzávalókat, morzsold rá a fetát, locsold meg."
    ]
  },
  {
    id: 25,
    title: "Édesburgonya Buddha Bowl",
    image: edesburgonyBuddhaBowl,
    description: "Buddha bowl sült édesburgonyával, babbal és avokádóval.",
    ingredients: [
      "2 édesburgonya",
      "1 avokádó",
      "400g fekete bab",
      "Saláta, olívaolaj, lime lé"
    ],
    instructions: [
      "Süsd meg a burgonyát, keverd össze a hozzávalókat, locsold meg."
    ]
  },
  {
    id: 26,
    title: "Spenótos Feta Csirke Wrap",
    image: spenotosTortilla,
    description: "Wrap grillezett csirkével, spenóttal és fetával.",
    ingredients: [
      "150g csirke",
      "Teljes kiőrlésű tortilla",
      "Spenót, feta"
    ],
    instructions: [
      "Szeleteld fel a csirkét, töltsd meg a tortillát, tekerd fel."
    ]
  },
  {
    id: 27,
    title: "Quinoa és Zöldség Burger",
    image: ZoldsegBurger,
    description: "Burger quinoa és zöldségekkel, magas rost- és fehérjetartalommal.",
    ingredients: [
      "100g quinoa",
      "Reszelt zöldségek, 1 tojás",
      "Teljes kiőrlésű zsemle, fűszerek"
    ],
    instructions: [
      "Keverd össze a hozzávalókat, formázz burgert, süsd, tálald."
    ]
  },
  {
    id: 28,
    title: "Lencseleves",
    image: lencseLeves,
    description: "Fehérjedús leves lencsével és zöldségekkel.",
    ingredients: [
      "200g vöröslencse",
      "1 hagyma, 2 fokhagyma",
      "2 sárgarépa, 1 paradicsom",
      "Alaplé, fűszerek"
    ],
    instructions: [
      "Pirítsd meg a hagymát és fokhagymát, add hozzá a lencsét és zöldségeket, főzd."
    ]
  },
  {
    id: 29,
    title: "Tofu Rántotta",
    image: tofuRantotta,
    description: "Vegan rántotta tofuval és zöldségekkel.",
    ingredients: [
      "200g tofu",
      "Vöröshagyma, paprika, spenót",
      "Kurkumapor, só, bors, olívaolaj"
    ],
    instructions: [
      "Morzsold össze a tofut, süsd meg a hagymát, add hozzá a tofu és zöldségeket, fűszerezd."
    ]
  },
  {
    id: 30,
    title: "Vegán Zöldséges Tál",
    image: veganZoldTal,
    description: "Vegán étel quinoa és zöldségekkel.",
    ingredients: [
      "100g quinoa",
      "1 avokádó",
      "Vegyes zöldségek, olívaolaj, citromlé"
    ],
    instructions: [
      "Főzd meg a quinoát, keverd össze az avokádóval és zöldségekkel."
    ]
  },
  {
    id: 31,
    title: "Protein Energy Bar",
    image: haziProtein,
    description: "Házi készítésű, energiadús rágcsálnivaló.",
    ingredients: [
      "100g zabpehely",
      "50g mandula",
      "1 kanál méz",
      "1 evőkanál proteinpor",
      "Kókuszreszelék"
    ],
    instructions: [
      "Keverd össze a hozzávalókat, süsd 180°C-on, szeleteld fel."
    ]
  },
  {
    id: 32,
    title: "Sült Csirke és Brokkoli Stir-Fry",
    image: sultCsirkeBrokoliStirfry,
    description: "Stir-fry csirkével és brokkolival.",
    ingredients: [
      "150g csirke",
      "Brokkoli, paprika, sárgarépa",
      "Szójaszósz, olívaolaj, fokhagyma, gyömbér"
    ],
    instructions: [
      "Szeleteld fel a csirkét, süsd meg a zöldségekkel, szójaszósz hozzáadásával."
    ]
  },
  {
    id: 33,
    title: "Sült Tonhal és Avokádó Saláta",
    image: sultTonhalAvokadoSalata,
    description: "Saláta sült tonhallal és avokádóval.",
    ingredients: [
      "200g tonhal",
      "Avokádó",
      "Saláta, olívaolaj, citromlé, só, bors"
    ],
    instructions: [
      "Süsd meg a tonhalat, szeleteld, keverd össze a salátával, locsold meg."
    ]
  },
  {
    id: 34,
    title: "Zöldség Spaghetti",
    image: zoldsegSpaghetti,
    description: "Cukkini spagetti paradicsomszósszal.",
    ingredients: [
      "2 cukkini (spiralizált)",
      "Paradicsomszósz, fokhagyma, bazsalikom, olívaolaj, só, bors"
    ],
    instructions: [
      "Készítsd el a spiralizált cukkinit, keverd össze a szósszal, tálald."
    ]
  },
  {
    id: 35,
    title: "Banános Protein Muffin",
    image: bananosProteinMuffin,
    description: "Proteinben gazdag muffin reggelire vagy uzsonnára.",
    ingredients: [
      "2 banán",
      "2 tojás",
      "50g zabpehely",
      "1 kanál proteinpor",
      "Fahéj"
    ],
    instructions: [
      "Pürésítsd a banánt, keverd össze a hozzávalókat, süsd 180°C-on."
    ]
  },
  {
    id: 36,
    title: "Mandula és Gyümölcs Saláta",
    image: mandulaGyumolcs,
    description: "Saláta mandulával és szezonális gyümölcsökkel.",
    ingredients: [
      "Vegyes zöldsaláta",
      "Alma, körte, narancs",
      "Mandula, olívaolaj, balzsamecet, só, bors"
    ],
    instructions: [
      "Vágd fel a gyümölcsöket, keverd össze a salátával, locsold meg."
    ]
  },
  {
    id: 37,
    title: "Rákos Avokádó Saláta",
    image: rakosAvokadoSalata,
    description: "Saláta főtt rák, avokádó és zöldségek kombinációjával.",
    ingredients: [
      "200g főtt rák",
      "1 avokádó",
      "Saláta, citromlé, olívaolaj, só, bors"
    ],
    instructions: [
      "Vágd fel az avokádót, keverd össze a salátával, add hozzá a rákot, locsold meg."
    ]
  },
  {
    id: 38,
    title: "Csirke Caesar Saláta Egészséges Változat",
    image: csirkeCeaserSalataEgeszseges,
    description: "Caesar saláta könnyített öntettel, grillezett csirkével.",
    ingredients: [
      "150g csirke",
      "Saláta, parmezán, kruton, joghurt alapú öntet"
    ],
    instructions: [
      "Keverd össze a salátát az öntettel, tálald a csirkét és krutonnal."
    ]
  },
  {
    id: 39,
    title: "Quinoa és Bab Saláta",
    image: quionaBabSalata,
    description: "Saláta quinoával és vegyes babokkal.",
    ingredients: [
      "100g quinoa",
      "200g vegyes bab",
      "Paradicsom, uborka, olívaolaj, citromlé, só, bors, petrezselyem"
    ],
    instructions: [
      "Főzd meg a quinoát, hűtsd le, keverd össze a hozzávalókat."
    ]
  },
  {
    id: 40,
    title: "Mediterrán Tofu Bowl",
    image: mediterranTofuBowl,
    description: "Tál tofuval, olívabogyóval, paradicsommal és quinoával.",
    ingredients: [
      "200g tofu",
      "100g quinoa",
      "Olívabogyó, paradicsom, bazsalikom, olívaolaj, citromlé, só, bors"
    ],
    instructions: [
      "Süsd meg a tofut, főzd meg a quinoát, keverd össze, locsold meg."
    ]
  }
];

const ReceptekPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredRecipes = recipesData.filter((recipe: Recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // A featured receptekhez egy szeletet használunk (például index 34–39)
  const featuredRecipes = filteredRecipes.slice(34, 40);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Húzással történő navigációhoz (swipe/drag)
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + featuredRecipes.length) % featuredRecipes.length);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % featuredRecipes.length);
  };

  // Touch események
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (dragStart === null || dragEnd === null) return;
    const distance = dragStart - dragEnd;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setDragStart(null);
    setDragEnd(null);
  };

  // Mouse események (asztali gép esetén)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStart !== null) {
      setDragEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (dragStart === null || dragEnd === null) return;
    const distance = dragStart - dragEnd;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setDragStart(null);
    setDragEnd(null);
  };

  const handleMouseLeave = () => {
    if (dragStart !== null && dragEnd !== null) {
      handleMouseUp();
    }
  };

  // Reszponzivitás: Sidebar állapotának és az ablakméret követése
  const [menuOpen, setMenuOpen] = useState<boolean>(window.innerWidth > 768);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setMenuOpen(true);
      } else {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Kezdeti állapot

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleOverlayClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Hamburger menü ikon mobil nézethez */}
      <div className={`hamburger-menu ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Overlay a mobil sidebar mögött */}
      <div 
        className={`sidebar-overlay ${menuOpen && windowWidth <= 768 ? "active" : ""}`}
        onClick={handleOverlayClick}
      ></div>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${menuOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
        <h2 onClick={() => navigate("/")} className="logo animated-logo">
            TestreSzabva
          </h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}> 📊 Áttekintés</button>
          <button onClick={() => navigate("/progress")}> 📈 Haladás</button>
          <button onClick={() => navigate("/receptek")}> 🍽️ Receptek</button>
          <button onClick={() => navigate("/settings")}> ⚙️ Beállítások</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={() => navigate("/")}>
            Kijelentkezés
          </button>
        </div>
      </aside>

      <div className="dashboard-content receptek-content">
        <header className="content-header">
          <h1>Receptek</h1>
          <p>
            Fedezd fel a tápláló, ízletes recepteket, melyek nemcsak az egészségedet támogatják,
            de inspirációt adnak a változatos étrendhez!
          </p>
        </header>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Keresés receptek között..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {searchTerm.trim() === "" && featuredRecipes.length > 0 && (
          <section className="featured-recipes">
            <h2>Ezeket az ételeket fogyasztják legszívesebben felhasználóink!</h2>
            <div className="carousel-wrapper">
              <div 
                className="carousel"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {featuredRecipes.map((recipe: Recipe, index) => {
                  let className = "carousel-card";
                  if (index === activeIndex) {
                    className += " active";
                  } else if (index === (activeIndex - 1 + featuredRecipes.length) % featuredRecipes.length) {
                    className += " prev";
                  } else if (index === (activeIndex + 1) % featuredRecipes.length) {
                    className += " next";
                  } else {
                    className += " hidden";
                  }
                  return (
                    <div key={recipe.id} className={className}>
                      <img src={recipe.image} alt={recipe.title} />
                      <div className="carousel-info">
                        <h3>{recipe.title}</h3>
                        <p>{recipe.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="all-recipes">
          <h2>Receptjeink</h2>
          <div className="recipes-grid">
            {filteredRecipes.map((recipe: Recipe) => (
              <div key={recipe.id} className="recipe-card">
                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  <p className="recipe-description">{recipe.description}</p>
                  <div className="recipe-details">
                    <div className="ingredients">
                      <h4>Hozzávalók:</h4>
                      <ul>
                        {recipe.ingredients.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="instructions">
                      <h4>Elkészítés:</h4>
                      <ol>
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReceptekPage;