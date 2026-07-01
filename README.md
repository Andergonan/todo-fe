## Spuštění

Backend není součástí tohoto FE repozitáře. Pro lokální spuštění aplikace je potřeba jej naklonovat samostatně: https://github.com/morosystems/todo-be .

- Dokumentace ke spuštění backendu je dostupná přímo v daném repozitáři.
- Backend v rámci tohoto řešení neupravuji a používám jej pouze jako "externí" API. Z tohoto důvodu není fork backendového repozitáře nutný.

### Doporučená struktura

- /todo
  - /todo-fe
  - /todo-be

### Vytvoření .env

V adresáři `/todo-fe` vytvořte `.env` podle `.env.example`

## Dokumentace

### Použité technologie

- React
- TypeScript
- Vite
  - Next.js by byl pro toto řešení zbytečně robustní. Vite je jednodušší a čistší volba pro samostatnou frontendovou aplikaci.
- Redux Toolkit + RTK Query
  - RTK Query je využito pro komunikaci s REST API. V souboru `tasksApi.ts` jsou definovány endpointy pro práci s úkoly. Z těchto endpointů RTK Query generuje typově bezpečné React hooky a zároveň zajišťuje správu cache i stavů požadavků, například loading a error.
- react-i18next
  - Lokalizace aplikace (CZ/EN).
- Tailwind CSS
- Shadcn/ui
- ESLint
- Prettier

### Funkčnost

- Aplikace pokrývá požadované funkcionality dle zadání.

#### Rozšíření nad rámec zadání

- aplikace podporuje vícejazyčnost v češtině a angličtině
- datumy jsou formátovány podle aktuálně zvoleného jazyka
- po hromadném označení úkolů jako dokončených je možné úkoly opět hromadně odznačit
- zobrazuje se počet aktivních i dokončených úkolů
- u každého filtru se zobrazuje počet úkolů, které do daného filtru spadají
- u každého úkolu se zobrazuje datum vytvoření a případně také datum dokončení
