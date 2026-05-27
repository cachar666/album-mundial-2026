import { useState, useMemo, useCallback } from "react";

// ─── Data: Checklist oficial Panini FIFA World Cup 2026 (980 láminas) ────
const INTRO_STICKERS = [
  { code: "00", label: "Panini Logo - We Are Panini", foil: true },
  { code: "FWC1", label: "Emblema Oficial", foil: true },
  { code: "FWC2", label: "Emblema Oficial (2)", foil: true },
  { code: "FWC3", label: "Mascotas Oficiales", foil: true },
  { code: "FWC4", label: "Eslogan Oficial", foil: true },
  { code: "FWC5", label: "Balón Oficial", foil: true },
  { code: "FWC6", label: "Canadá - Sedes", foil: true },
  { code: "FWC7", label: "México - Sedes", foil: true },
  { code: "FWC8", label: "USA - Sedes", foil: true },
];

const HISTORY_STICKERS = [
  { code: "FWC9", label: "Italia 1934", foil: true },
  { code: "FWC10", label: "Uruguay 1950", foil: true },
  { code: "FWC11", label: "Alemania 1954", foil: true },
  { code: "FWC12", label: "Brasil 1962", foil: true },
  { code: "FWC13", label: "Alemania 1974", foil: true },
  { code: "FWC14", label: "Argentina 1986", foil: true },
  { code: "FWC15", label: "Brasil 1994", foil: true },
  { code: "FWC16", label: "Brasil 2002", foil: true },
  { code: "FWC17", label: "Italia 2006", foil: true },
  { code: "FWC18", label: "Alemania 2014", foil: true },
  { code: "FWC19", label: "Argentina 2022", foil: true },
];

const TEAMS = [
  { id: "MEX", name: "México", flag: "🇲🇽", players: ["Luis Malagón","Johan Vasquez","Jorge Sánchez","Cesar Montes","Jesus Gallardo","Israel Reyes","Diego Lainez","Carlos Rodriguez","Edson Alvarez","Orbelin Pineda","Marcel Ruiz","Érick Sánchez","Hirving Lozano","Santiago Giménez","Raúl Jiménez","Alexis Vega","Roberto Alvarado","Cesar Huerta"] },
  { id: "RSA", name: "Sudáfrica", flag: "🇿🇦", players: ["Ronwen Williams","Sipho Chaine","Aubrey Modiba","Samukele Kabini","Mbekezeli Mbokazi","Khulumani Ndamane","Siyabonga Ngezana","Khuliso Mudau","Nkosinathi Sibisi","Teboho Mokoena","Thalente Mbatha","Bathasi Aubaas","Yaya Sithole","Sipho Mbule","Lyle Foster","Iqraam Rayners","Mohau Nkota","Oswin Appollis"] },
  { id: "KOR", name: "Corea del Sur", flag: "🇰🇷", players: ["Hyeon-woo Jo","Seung-Gyu Kim","Min-jae Kim","Yu-min Cho","Young-woo Seol","Han-beom Lee","Tae-seok Lee","Myung-jae Lee","Jae-sung Lee","In-beom Hwang","Kang-in Lee","Seung-ho Paik","Jens Castrop","Dongg-yeong Lee","Gue-sung Cho","Heung-min Son","Hee-chan Hwang","Hyeon-Gyu Oh"] },
  { id: "CZE", name: "Chequia", flag: "🇨🇿", players: ["Matej Kovar","Jindrich Stanek","Ladislav Krejci","Vladimir Coufal","Jaroslav Zeleny","Tomas Holes","David Zima","Michal Sadilek","Lukas Provod","Lukas Cerv","Tomas Soucek","Pavel Sulc","Matej Vydra","Vasil Kusej","Tomas Chory","Vaclav Cerny","Adam Hlozek","Patrik Schick"] },
  { id: "CAN", name: "Canadá", flag: "🇨🇦", players: ["Dayne St.Clair","Alphonso Davies","Alistair Johnston","Samuel Adekugbe","Riche Larvea","Derek Cornelius","Moïse Bombito","Kamal Miller","Stephen Eustáquio","Ismaël Koné","Jonathan Osorio","Jacob Shaffelburg","Mathieu Choinière","Niko Sigur","Tajon Buchanan","Liam Millar","Cyle Larin","Jonathan David"] },
  { id: "BIH", name: "Bosnia y Herz.", flag: "🇧🇦", players: ["Nikola Vasilj","Amer Dedic","Sead Kolasinac","Tarik Muharemovic","Nihad Mujakic","Nikola Katic","Amir Hadziahmetovic","Benjamin Tahirovic","Armin Gigovic","Ivan Sunjic","Ivan Basic","Dzenis Burnic","Esmir Bajraktarevic","Amar Memic","Ermedin Demirovic","Edin Dzeko","Samed Bazdar","Haris Tabakovic"] },
  { id: "QAT", name: "Catar", flag: "🇶🇦", players: ["Meshaal Barsham","Sultan Albrake","Lucas Mendes","Homam Ahmed","Boualem Khoukhi","Pedro Miguel","Tarek Salman","Mohamed Al-Mannai","Karim Boudiaf","Assim Madibo","Ahmed Fatehi","Mohammed Waad","Abdulaziz Hatem","Hassan Al-Haydos","Edmilson Junior","Akram Hassan Afif","Ahmed Al Ganehi","Almoez Ali"] },
  { id: "SUI", name: "Suiza", flag: "🇨🇭", players: ["Gregor Kobel","Yvon Mvogo","Manuel Akanji","Ricardo Rodriguez","Nico Elvedi","Aurèle Amenda","Silvan Widmer","Granit Xhaka","Denis Zakaria","Remo Freuler","Fabian Rieder","Ardon Jashari","Johan Manzambi","Michel Aebischer","Breel Embolo","Ruben Vargas","Dan Ndoye","Zeki Amdouni"] },
  { id: "BRA", name: "Brasil", flag: "🇧🇷", players: ["Alisson","Bento","Marquinhos","Éder Militão","Gabriel Magalhães","Danilo","Wesley","Lucas Paquetá","Casemiro","Bruno Guimarães","Luiz Henrique","Vinicius Júnior","Rodrygo","João Pedro","Matheus Cunha","Gabriel Martinelli","Raphinha","Estévão"] },
  { id: "MAR", name: "Marruecos", flag: "🇲🇦", players: ["Yassine Bounou","Munir El Kajoui","Achraf Hakimi","Noussair Mazraoui","Nayef Aguerd","Roman Saiss","Jawad El Yamio","Adam Masina","Sofyan Amrabat","Azzedine Ounahi","Eliesse Ben Seghir","Bilal El Khannouss","Ismael Saibari","Youssef En-Nesyri","Abde Ezzalzouli","Soufiane Rahimi","Brahim Diaz","Ayoub El Kaabi"] },
  { id: "HAI", name: "Haití", flag: "🇭🇹", players: ["Johny Placide","Carlens Arcus","Martin Expérience","Jean-Kevin Duverne","Ricardo Adé","Duke Lacroix","Garven Metusala","Hannes Delcroix","Leverton Pierre","Danley Jean Jacques","Jean-Ricner Bellegarde","Christopher Attys","Derrick Etienne Jr","Josue Casimir","Ruben Providence","Duckens Nazon","Louicius Deedson","Frantzdy Pierrot"] },
  { id: "SCO", name: "Escocia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", players: ["Angus Gunn","Jack Hendry","Kieran Tierney","Aaron Hickey","Andrew Robertson","Scott McKenna","John Souttar","Anthony Ralston","Grant Hanley","Scott McTominay","Billy Gilmour","Lewis Ferguson","Ryan Christie","Kenny McLean","John McGinn","Lyndon Dykes","Che Adams","Ben Gannon-Doak"] },
  { id: "USA", name: "Estados Unidos", flag: "🇺🇸", players: ["Math Freese","Chris Richards","Tim Ream","Mark McKenzie","Alex Freeman","Antonee Robinson","Tyler Adams","Tanner Tessmann","Weston McKenny","Christian Roldan","Timothy Weah","Diego Luna","Malik Tillman","Christian Pulisic","Brenden Aaronson","Ricardo Pepi","Haji Wright","Folarin Balogun"] },
  { id: "PAR", name: "Paraguay", flag: "🇵🇾", players: ["Roberto Fernandez","Orlando Gill","Gustavo Gomez","Fabián Balbuena","Juan José Cáceres","Omar Alderete","Junior Alonso","Mathías Villasanti","Diego Gomez","Damián Bobadilla","Andres Cubas","Matias Galarza Fonda","Julio Enciso","Alejandro Romero Gamarra","Miguel Almirón","Ramon Sosa","Angel Romero","Antonio Sanabria"] },
  { id: "AUS", name: "Australia", flag: "🇦🇺", players: ["Mathew Ryan","Joe Gauci","Harry Souttar","Alessandro Circati","Jordan Bos","Aziz Behich","Cameron Burgess","Lewis Miller","Milos Degenek","Jackson Irvine","Riley McGree","Aiden O'Neill","Connor Metcalfe","Patrick Yazbek","Craig Goodwin","Kusini Vengi","Nestory Irankunda","Mohamed Touré"] },
  { id: "TUR", name: "Türkiye", flag: "🇹🇷", players: ["Ugurcan Cakir","Mert Muldur","Zeki Celik","Abdulkerim Bardakci","Caglar Soyuncu","Merih Demiral","Ferdi Kadioglu","Kaan Ayhan","Ismail Yuksek","Hakan Calhanoglu","Orkun Kokcu","Arda Guler","Irfan Can Kahveci","Yunus Akgun","Can Uzun","Baris Alper Yilmaz","Kerem Akturkoglu","Kenan Yildiz"] },
  { id: "GER", name: "Alemania", flag: "🇩🇪", players: ["Marc-André ter Stegen","Jonathan Tah","David Raum","Nico Schlotterbeck","Antonio Rüdiger","Waldemar Anton","Ridle Baku","Maximilian Mittelstadt","Joshua Kimmich","Florian Wirtz","Felix Nmecha","Leon Goretzka","Jamal Musiala","Serge Gnabry","Kai Havertz","Leroy Sane","Karim Adeyemi","Nick Woltemade"] },
  { id: "CUW", name: "Curazao", flag: "🇨🇼", players: ["Eloy Room","Armando Obispo","Sherel Floranus","Jurien Gaari","Joshua Brenet","Roshon Van Eijma","Shurandy Sambo","Livano Comenencia","Godfried Roemeratoe","Juninho Bacuna","Leandro Bacuna","Tahith Chong","Kenji Gorre","Jearl Margaritha","Jurgen Locadia","Jeremy Antonisse","Gervane Kastaneer","Sontje Hansen"] },
  { id: "CIV", name: "Costa de Marfil", flag: "🇨🇮", players: ["Yahia Fofana","Ghislain Konan","Wilfried Singo","Odilon Kossounou","Evan Ndicka","Willy Boly","Emmanuel Agbadou","Ousmane Diomande","Franck Kessie","Seko Fofana","Ibrahim Sangare","Jean-Philippe Gbamin","Amad Diallo","Sébastien Haller","Simon Adingra","Yan Diomande","Evann Guessand","Oumar Diakite"] },
  { id: "ECU", name: "Ecuador", flag: "🇪🇨", players: ["Hernán Galíndez","Gonzalo Valle","Piero Hincapié","Pervis Estupiñán","Willian Pacho","Ángelo Preciado","Joel Ordóñez","Moises Caicedo","Alan Franco","Kendry Paez","Pedro Vite","John Veboah","Leonardo Campana","Gonzalo Plata","Nilson Angulo","Alan Minda","Kevin Rodriguez","Enner Valencia"] },
  { id: "NED", name: "Países Bajos", flag: "🇳🇱", players: ["Bart Verbruggen","Virgil van Dijk","Micky van de Ven","Jurrien Timber","Denzel Dumfries","Nathan Aké","Jeremie Frimpong","Jan Paul van Hecke","Tijjani Reijnders","Ryan Gravenberch","Teun Koopmeiners","Frenkie de Jong","Xavi Simons","Justin Kluivert","Memphis Depay","Donyell Malen","Wout Weghorst","Cody Gakpo"] },
  { id: "JPN", name: "Japón", flag: "🇯🇵", players: ["Zion Suzuki","Henry Heroki Mochizuki","Ayumu Seko","Junnosuke Suzuki","Shogo Taniguchi","Tsuyoshi Watanabe","Kaishu Sano","Yuki Soma","Ao Tanaka","Daichi Kamada","Takefusa Kubo","Ritsu Doan","Keito Nakamura","Takumi Minamino","Shuto Machino","Junya Ito","Koki Ogawa","Ayase Ueda"] },
  { id: "SWE", name: "Suecia", flag: "🇸🇪", players: ["Victor Johansson","Isak Hien","Gabriel Gudmundsson","Emil Holm","Victor Nilsson Lindelöf","Gustaf Lagerbielke","Lucas Bergvall","Hugo Larsson","Jesper Karlström","Yasin Ayari","Mattias Svanberg","Daniel Svensson","Ken Sema","Roony Bardghji","Dejan Kulusevski","Anthony Elanga","Alexander Isak","Viktor Gyökeres"] },
  { id: "TUN", name: "Túnez", flag: "🇹🇳", players: ["Bechir Ben Said","Aymen Dahmen","Yan Valery","Montassar Talbi","Yassine Meriah","Ali Abdi","Dylan Bronn","Ellyes Skhiri","Aissa Laidouni","Ferjani Sassi","Mohamed Ali Ben Romdhane","Hannibal Mejbri","Elias Achouri","Elias Saad","Hazem Mastouri","Ismael Gharbi","Sayfallah Ltaief","Naim Sliti"] },
  { id: "BEL", name: "Bélgica", flag: "🇧🇪", players: ["Thibaut Courtois","Arthur Theate","Timothy Castagne","Zeno Debast","Brandon Mechele","Maxim De Cuyper","Thomas Meunier","Youri Tielemans","Amadou Onana","Nicolas Raskin","Alexis Saelemaekers","Hans Vanaken","Kevin De Bruyne","Jérémy Doku","Charles De Ketelaere","Leandro Trossard","Loïs Openda","Romelu Lukaku"] },
  { id: "EGY", name: "Egipto", flag: "🇪🇬", players: ["Mohamed El Shenawy","Mohamed Hany","Mohamed Hamdy","Yasser Ibrahim","Khaled Sobhi","Ramy Rabia","Hossam Abdelmaguid","Ahmed Fatouh","Marwan Attia","Zizo","Hamdy Fathy","Mohamed Lasheen","Emam Ashour","Osama Faisal","Mohamed Salah","Mostafa Mohamed","Trezeguet","Omar Marmoush"] },
  { id: "IRN", name: "Irán", flag: "🇮🇷", players: ["Alireza Beiranvand","Morteza Pouraliganji","Ehsan Hajsafi","Milad Mohammadi","Shojae Khalilzadeh","Ramin Rezaeian","Hossein Kanaani","Sadegh Moharrami","Saleh Hardani","Saeed Ezatolahi","Saman Ghoddos","Omid Noorafkan","Roozbeh Cheshmi","Mohammad Mohebi","Sardar Azmoun","Mehdi Taremi","Alireza Jahanbakhsh","Ali Gholizadeh"] },
  { id: "NZL", name: "Nueva Zelanda", flag: "🇳🇿", players: ["Max Crocombe Payne","Alex Paulsen","Michael Boxall","Liberato Cacace","Tim Payne","Tyler Bindon","Francis de Vries","Finn Surman","Joe Bell","Sarpreet Singh","Ryan Thomas","Matthew Garbett","Marko Stamenić","Ben Old","Chris Wood","Elijah Just","Callum McCowatt","Kosta Barbarouses"] },
  { id: "ESP", name: "España", flag: "🇪🇸", players: ["Unai Simon","Robin Le Normand","Aymeric Laporte","Dean Huijsen","Pedro Porro","Dani Carvajal","Marc Cucurella","Martín Zubimendi","Rodri","Pedri","Fabian Ruiz","Mikel Merino","Lamine Yamal","Dani Olmo","Nico Williams","Ferran Torres","Álvaro Morata","Mikel Oyarzabal"] },
  { id: "CPV", name: "Cabo Verde", flag: "🇨🇻", players: ["Vozinha","Logan Costa","Pico","Diney","Steven Moreira","Wagner Pina","Joao Paulo","Yannick Semedo","Kevin Pina","Patrick Andrade","Jamiro Monteiro","Deroy Duarte","Garry Rodrigues","Jovane Cabral","Ryan Mendes","Dailon Livramento","Willy Semedo","Bebe"] },
  { id: "KSA", name: "Arabia Saudita", flag: "🇸🇦", players: ["Nawaf Alaqidi","Abdulrahman Al-Sanbi","Saud Abdulhamid","Nawaf Bouwashl","Jihad Thakri","Moteb Al-Harbi","Hassan Altambakti","Musab Aljuwayr","Ziyad Aljohani","Abdullah Alkhaibari","Nasser Aldawsari","Saleh Abu Alshamat","Marwan Alsahafi","Salem Aldawsari","Abdulrahman Al-Aboud","Feras Akbrikan","Saleh Alshehri","Abdullah Al-Hamdan"] },
  { id: "URU", name: "Uruguay", flag: "🇺🇾", players: ["Sergio Rochet","Santiago Mele","Ronald Araujo","José María Giménez","Sebastian Caceres","Mathias Olivera","Guillermo Varela","Nahitan Nandez","Federico Valverde","Giorgian De Arrascaeta","Rodrigo Bentancur","Manuel Ugarte","Nicolás de la Cruz","Maxi Araujo","Darwin Núñez","Federico Viñas","Rodrigo Aguirre","Facundo Pellistri"] },
  { id: "FRA", name: "Francia", flag: "🇫🇷", players: ["Mike Maignan","Theo Hernandez","William Saliba","Jules Kounde","Ibrahima Konate","Dayot Upamecano","Lucas Digne","Aurélien Tchouaméni","Eduardo Camavinga","Manu Kone","Adrien Rabiot","Michael Olise","Ousmane Dembele","Bradley Barcola","Désiré Doué","Kingsley Coman","Hugo Ekitike","Kylian Mbappe"] },
  { id: "SEN", name: "Senegal", flag: "🇸🇳", players: ["Edouard Mendy","Yehvann Diouf","Moussa Niakhaté","Abdoulaye Seck","Ismail Jakobs","El Hadji Malick Diouf","Kalidou Koulibaly","Idrissa Gana Gueye","Pape Matar Sarr","Pape Gueye","Habib Diarra","Lamine Camara","Sadio Mane","Ismaïla Sarr","Boulaye Dia","Iliman Ndiaye","Nicolas Jackson","Krepin Diatta"] },
  { id: "IRQ", name: "Irak", flag: "🇮🇶", players: ["Jalal Hassan","Rebin Sulaka","Hussein Ali","Akam Hashem","Merchas Doski","Zaid Tahseen","Manaf Younis","Zidane Iqbal","Amir Al-Ammari","Ibrahim Bavesh","Ali Jasim","Youssef Amyn","Aimar Sher","Marko Farji","Osama Rashid","Ali Al-Hamadi","Aymen Hussein","Mohanad Ali"] },
  { id: "NOR", name: "Noruega", flag: "🇳🇴", players: ["Orjan Nyland","Julian Ryerson","Leo Ostigård","Kristoffer Vassbakk Ajer","Marcus Holmgren Pedersen","David Møller Wolfe","Torbjørn Heggem","Morten Thorsby","Martin Ødegaard","Sander Berge","Andreas Schjelderup","Patrick Berg","Erling Haaland","Alexander Sørloth","Aron Dønnum","Jorgen Strand Larsen","Antonio Nusa","Oscar Bobb"] },
  { id: "ARG", name: "Argentina", flag: "🇦🇷", players: ["Emiliano Martinez","Nahuel Molina","Cristian Romero","Nicolas Otamendi","Nicolas Tagliafico","Leonardo Balerdi","Enzo Fernandez","Alexis Mac Allister","Rodrigo De Paul","Exequiel Palacios","Leandro Paredes","Nico Paz","Franco Mastantuono","Nico Gonzalez","Lionel Messi","Lautaro Martinez","Julian Alvarez","Giuliano Simeone"] },
  { id: "ALG", name: "Argelia", flag: "🇩🇿", players: ["Alexis Guendouz","Ramy Bensebaini","Youcef Atal","Rayan Aït-Nouri","Mohamed Amine Tougai","Aïssa Mandi","Ismael Bennacer","Houssem Aquar","Hicham Boudaoui","Ramiz Zerrouki","Nabil Bentalab","Farés Chaibi","Riyad Mahrez","Said Benrahma","Anis Hadj Moussa","Amine Gouiri","Baghdad Bounedjah","Mohammed Amoura"] },
  { id: "AUT", name: "Austria", flag: "🇦🇹", players: ["Alexander Schlager","Patrick Pentz","David Alaba","Kevin Danso","Philipp Lienhart","Stefan Posch","Phillipp Mwene","Alexander Prass","Xaver Schlager","Marcel Sabitzer","Konrad Laimer","Florian Grillitsch","Nicolas Seiwald","Romano Schmid","Patrick Wimmer","Christoph Baumgartner","Michael Gregoritsch","Marko Arnautović"] },
  { id: "JOR", name: "Jordania", flag: "🇯🇴", players: ["Yazeed Abulaila","Ihsan Haddad","Mohammad Abu Hashish","Yazan Al-Arab","Abdallah Nasib","Saleem Obaid","Mohammad Abualnadi","Ibrahim Saadeh","Nizar Al-Rashdan","Noor Al-Rawabdeh","Mohannad Abu Taha","Amer Jamous","Musa Al-Taamari","Yazan Al-Naimat","Mahmoud Al-Mardi","Ali Olwan","Mohammad Abu Zrayq","Ibrahim Sabra"] },
  { id: "POR", name: "Portugal", flag: "🇵🇹", players: ["Diogo Costa","Jose Sa","Ruben Dias","João Cancelo","Diogo Dalot","Nuno Mendes","Gonçalo Inácio","Bernardo Silva","Bruno Fernandes","Ruben Neves","Vitinha","João Neves","Cristiano Ronaldo","Francisco Trincao","João Felix","Gonçalo Ramos","Pedro Neto","Rafael Leão"] },
  { id: "COD", name: "RD Congo", flag: "🇨🇩", players: ["Lionel Mpasi","Aaron Wan-Bissaka","Axel Tuanzebe","Arthur Masuaku","Chancel Mbemba","Joris Kayembe","Charles Pickel","Ngal'ayel Mukau","Edo Kayembe","Samuel Moutoussamy","Noah Sadiki","Théo Bongonda","Meschak Elia","Yoane Wissa","Brian Cipenga","Fiston Mayele","Cédric Bakambu","Nathanaël Mbuku"] },
  { id: "UZB", name: "Uzbekistán", flag: "🇺🇿", players: ["Utkir Yusupov","Farrukh Savfiev","Sherzod Nasrullaev","Umar Eshmurodov","Husniddin Aliqulov","Rustamjon Ashurmatov","Khojiakbar Alijonov","Abdukodir Khusanov","Odiljon Hamrobekov","Otabek Shukurov","Jamshid Iskanderov","Azizbek Turgunboev","Khojimat Erkinov","Eldor Shomurodov","Oston Urunov","Jaloliddin Masharipov","Igor Sergeev","Abbosbek Fayzullaev"] },
  { id: "COL", name: "Colombia", flag: "🇨🇴", players: ["Camilo Vargas","David Ospina","Dávinson Sánchez","Yerry Mina","Daniel Munoz","Johan Mojica","Jhon Lucumí","Santiago Arias","Jefferson Lerma","Kevin Castaño","Richard Rios","James Rodriguez","Juan Fernando Quintero","Jorge Carrascal","Jon Arias","Jhon Cordova","Luis Suarez","Luis Diaz"] },
  { id: "ENG", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", players: ["Jordan Pickford","John Stones","Marc Guéhi","Ezri Konsa","Trent Alexander-Arnold","Reece James","Dan Burn","Jordan Henderson","Declan Rice","Jude Bellingham","Cole Palmer","Morgan Rogers","Anthony Gordon","Phil Foden","Bukayo Saka","Harry Kane","Marcus Rashford","Ollie Watkins"] },
  { id: "CRO", name: "Croacia", flag: "🇭🇷", players: ["Dominik Livaković","Duje Caleta-Car","Josko Gvardiol","Josip Stanišić","Luka Vušković","Josip Sutalo","Kristijan Jakic","Luka Modrić","Mateo Kovacic","Martin Baturina","Lovro Majer","Mario Pasalic","Petar Sucic","Ivan Perišić","Marco Pasalic","Ante Budimir","Andrej Kramarić","Franjo Ivanovic"] },
  { id: "GHA", name: "Ghana", flag: "🇬🇭", players: ["Lawrence Ati Zigi","Tariq Lamptey","Mohammed Salisu","Alidu Seidu","Alexander Djiku","Gideon Mensah","Caleb Yirenkyi","Abdul Issahaku Fatawu","Thomas Partey","Salis Abdul Samed","Kamaldeen Sulemana","Mohammed Kudus","Inaki Williams","Jordan Ayew","Andrew Ayew","Joseph Paintsil","Osman Bukari","Antoine Semenyo"] },
  { id: "PAN", name: "Panamá", flag: "🇵🇦", players: ["Orlando Mosquera","Luis Mejia","Fidel Escobar","Andres Andrade","Michael Amir Murillo","Eric Davis","Jose Cordoba","Cesar Blackman","Cristian Martinez","Aníbal Godoy","Adalberto Carrasquilla","Édgar Bárcenas","Carlos Harvey","Ismael Díaz","Jose Fajardo","Cecilio Waterman","Jose Luiz Rodriguez","Alberto Quintero"] },
];

// Build sticker list for each team: Logo(FOIL) + 2 players + Team Photo + 16 players = 20
function buildTeamStickers(team) {
  const stickers = [];
  stickers.push({ code: `${team.id}1`, label: `${team.name} - Escudo`, foil: true });
  // Players 1-11 map to codes 2-12
  for (let i = 0; i < 11; i++) {
    stickers.push({ code: `${team.id}${i + 2}`, label: team.players[i] });
  }
  // Team photo at position 13
  stickers.push({ code: `${team.id}13`, label: `${team.name} - Foto Equipo` });
  // Players 12-18 map to codes 14-20
  for (let i = 11; i < 18; i++) {
    stickers.push({ code: `${team.id}${i + 3}`, label: team.players[i] });
  }
  return stickers;
}

// Build all sections
const ALBUM_SECTIONS = [
  { id: "intro", name: "FIFA World Cup 2026", emoji: "🏆", stickers: INTRO_STICKERS },
  { id: "history", name: "Historia de los Mundiales", emoji: "📜", stickers: HISTORY_STICKERS },
  ...TEAMS.map((t) => ({
    id: t.id,
    name: t.name,
    emoji: t.flag,
    stickers: buildTeamStickers(t),
  })),
];

const TOTAL_STICKERS = ALBUM_SECTIONS.reduce((sum, s) => sum + s.stickers.length, 0);

// ─── Main Component ──────────────────────────────────────────────────
export default function AlbumTracker() {
  const [owned, setOwned] = useState({});
  const [dupes, setDupes] = useState({});
  const [view, setView] = useState("home");
  const [selectedSection, setSelectedSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Stats
  const ownedCount = useMemo(() => Object.keys(owned).length, [owned]);
  const dupeCount = useMemo(() => Object.values(dupes).reduce((a, b) => a + b, 0), [dupes]);
  const pct = useMemo(() => ((ownedCount / TOTAL_STICKERS) * 100).toFixed(1), [ownedCount]);

  const toggleOwned = useCallback((code) => {
    setOwned((prev) => {
      const next = { ...prev };
      if (next[code]) {
        delete next[code];
        setDupes((d) => { const nd = { ...d }; delete nd[code]; return nd; });
      } else {
        next[code] = true;
      }
      return next;
    });
  }, []);

  const addDupe = useCallback((code, e) => {
    e.stopPropagation();
    if (!owned[code]) return;
    setDupes((prev) => ({ ...prev, [code]: (prev[code] || 0) + 1 }));
  }, [owned]);

  const removeDupe = useCallback((code, e) => {
    e.stopPropagation();
    setDupes((prev) => {
      const next = { ...prev };
      if (next[code] > 1) next[code]--;
      else delete next[code];
      return next;
    });
  }, [owned]);

  // Search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];
    for (const sec of ALBUM_SECTIONS) {
      for (const st of sec.stickers) {
        if (st.code.toLowerCase().includes(q) || st.label.toLowerCase().includes(q)) {
          results.push({ ...st, sectionName: sec.name, sectionEmoji: sec.emoji });
        }
      }
    }
    return results.slice(0, 50);
  }, [searchQuery]);

  // Section stats
  const sectionStats = useCallback((section) => {
    const total = section.stickers.length;
    const have = section.stickers.filter((s) => owned[s.code]).length;
    return { total, have, pct: ((have / total) * 100).toFixed(0) };
  }, [owned]);

  // Filter stickers
  const filteredStickers = useCallback((stickers) => {
    if (filter === "all") return stickers;
    if (filter === "missing") return stickers.filter((s) => !owned[s.code]);
    if (filter === "owned") return stickers.filter((s) => owned[s.code]);
    if (filter === "dupes") return stickers.filter((s) => dupes[s.code] > 0);
    return stickers;
  }, [filter, owned, dupes]);

  // ─── Progress Bar ──────────────────────────────────────────────────
  const ProgressBar = ({ value, size = "md" }) => (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${size === "sm" ? "h-2" : "h-3"}`}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(value, 100)}%`,
          background: value < 30 ? "#ef4444" : value < 70 ? "#f59e0b" : "#22c55e",
        }}
      />
    </div>
  );

  // ─── Sticker Card ──────────────────────────────────────────────────
  const StickerCard = ({ sticker }) => {
    const isOwned = owned[sticker.code];
    const dupeC = dupes[sticker.code] || 0;
    return (
      <div
        onClick={() => toggleOwned(sticker.code)}
        className={`rounded-xl p-3 cursor-pointer select-none transition-all duration-200 border-2 ${
          isOwned
            ? "bg-green-50 border-green-400 shadow-sm"
            : "bg-white border-gray-200 opacity-60"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                isOwned ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              {sticker.code}
            </span>
            <span className="text-sm truncate">
              {sticker.label}
              {sticker.foil && <span className="ml-1 text-yellow-500 text-xs">✦FOIL</span>}
            </span>
          </div>
          {isOwned && (
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <button
                onClick={(e) => removeDupe(sticker.code, e)}
                className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg font-bold active:bg-red-200"
              >
                −
              </button>
              <span className={`text-sm font-bold w-6 text-center ${dupeC > 0 ? "text-amber-600" : "text-gray-400"}`}>
                {dupeC}
              </span>
              <button
                onClick={(e) => addDupe(sticker.code, e)}
                className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold active:bg-amber-200"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── Header ────────────────────────────────────────────────────────
  const Header = ({ title, showBack = false, subtitle = null }) => (
    <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => {
              setView("home");
              setSelectedSection(null);
              setFilter("all");
            }}
            className="text-2xl"
          >
            ←
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold truncate">{title}</h1>
          {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  // ─── Home View ─────────────────────────────────────────────────────
  if (view === "home") {
    // Group: specials (intro, history) and teams
    const specials = ALBUM_SECTIONS.filter((s) => s.id === "intro" || s.id === "history");
    const teams = ALBUM_SECTIONS.filter((s) => s.id !== "intro" && s.id !== "history");

    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="🏆 Álbum Mundial 2026" subtitle="Panini - Colombia · 980 láminas" />

        {/* Progress Overview */}
        <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-3xl font-black text-blue-900">{pct}%</p>
              <p className="text-sm text-gray-500">{ownedCount} de {TOTAL_STICKERS} láminas</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-amber-600">{dupeCount}</p>
              <p className="text-xs text-gray-500">repetidas</p>
            </div>
          </div>
          <ProgressBar value={parseFloat(pct)} />
          <div className="flex gap-3 mt-3 text-xs text-gray-500">
            <span className="text-green-600 font-medium">✓ {ownedCount}</span>
            <span className="text-red-500 font-medium">✗ {TOTAL_STICKERS - ownedCount}</span>
            <span className="text-amber-600 font-medium">⟳ {dupeCount} rep.</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mx-4 mt-3">
          <button
            onClick={() => setView("search")}
            className="flex-1 bg-white rounded-xl p-3 shadow-sm border text-center active:bg-gray-50"
          >
            <span className="text-xl">🔍</span>
            <p className="text-xs mt-1 text-gray-600">Buscar</p>
          </button>
          <button
            onClick={() => setView("stats")}
            className="flex-1 bg-white rounded-xl p-3 shadow-sm border text-center active:bg-gray-50"
          >
            <span className="text-xl">📊</span>
            <p className="text-xs mt-1 text-gray-600">Estadísticas</p>
          </button>
          <button
            onClick={() => setView("dupes")}
            className="flex-1 bg-white rounded-xl p-3 shadow-sm border text-center active:bg-gray-50"
          >
            <span className="text-xl">🔄</span>
            <p className="text-xs mt-1 text-gray-600">Repetidas</p>
          </button>
        </div>

        {/* Specials */}
        <div className="mx-4 mt-4">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">Secciones Especiales</h2>
          {specials.map((sec) => {
            const st = sectionStats(sec);
            return (
              <div
                key={sec.id}
                onClick={() => { setSelectedSection(sec); setView("section"); }}
                className="bg-white rounded-xl p-3 mb-2 shadow-sm border cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{sec.emoji} {sec.name}</span>
                  <span className="text-sm text-gray-500">{st.have}/{st.total}</span>
                </div>
                <ProgressBar value={parseFloat(st.pct)} size="sm" />
              </div>
            );
          })}
        </div>

        {/* Teams */}
        <div className="mx-4 mt-4 pb-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-2">Selecciones ({teams.length})</h2>
          <div className="space-y-2">
            {teams.map((sec) => {
              const st = sectionStats(sec);
              const complete = parseInt(st.pct) === 100;
              return (
                <div
                  key={sec.id}
                  onClick={() => { setSelectedSection(sec); setView("section"); }}
                  className={`bg-white rounded-xl p-3 shadow-sm border cursor-pointer active:bg-gray-50 ${complete ? "border-green-300 bg-green-50" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{sec.emoji}</span>
                      <span className="font-medium">{sec.name}</span>
                      <span className="text-xs text-gray-400">{sec.id}</span>
                    </div>
                    <span className={`text-sm font-bold ${complete ? "text-green-600" : "text-gray-500"}`}>
                      {st.have}/{st.total}
                    </span>
                  </div>
                  <ProgressBar value={parseFloat(st.pct)} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── Section View ──────────────────────────────────────────────────
  if (view === "section" && selectedSection) {
    const st = sectionStats(selectedSection);
    const stickers = filteredStickers(selectedSection.stickers);
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title={`${selectedSection.emoji} ${selectedSection.name}`}
          subtitle={`${st.have}/${st.total} láminas (${st.pct}%)`}
          showBack
        />
        <div className="flex gap-2 px-4 py-2 overflow-x-auto sticky top-14 z-10 bg-gray-50">
          {[
            { key: "all", label: "Todas" },
            { key: "missing", label: "Faltan" },
            { key: "owned", label: "Tengo" },
            { key: "dupes", label: "Repetidas" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === f.key ? "bg-blue-900 text-white" : "bg-white text-gray-600 border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="px-4 pb-6 space-y-2">
          {stickers.length === 0 ? (
            <p className="text-center text-gray-400 mt-8">No hay láminas con este filtro</p>
          ) : (
            stickers.map((s) => <StickerCard key={s.code} sticker={s} />)
          )}
        </div>
      </div>
    );
  }

  // ─── Search View ───────────────────────────────────────────────────
  if (view === "search") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="🔍 Buscar Lámina" showBack />
        <div className="p-4">
          <input
            type="text"
            placeholder="Código (COL15) o nombre (James)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none text-lg"
            autoFocus
          />
          <div className="mt-3 space-y-2">
            {searchResults.map((r) => (
              <div key={r.code} className="flex items-center justify-between bg-white rounded-xl p-3 border">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${owned[r.code] ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
                      {r.code}
                    </span>
                    <span className="text-sm truncate">{r.label}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{r.sectionEmoji} {r.sectionName}</p>
                </div>
                <button
                  onClick={() => toggleOwned(r.code)}
                  className={`px-3 py-1 rounded-lg text-sm font-bold flex-shrink-0 ${
                    owned[r.code] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {owned[r.code] ? "✓" : "Agregar"}
                </button>
              </div>
            ))}
            {searchQuery && searchResults.length === 0 && (
              <p className="text-center text-gray-400 mt-8">No se encontraron láminas</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Dupes View ────────────────────────────────────────────────────
  if (view === "dupes") {
    const allDupes = [];
    for (const sec of ALBUM_SECTIONS) {
      for (const st of sec.stickers) {
        if (dupes[st.code] > 0) {
          allDupes.push({ ...st, count: dupes[st.code], sectionName: sec.name, sectionEmoji: sec.emoji });
        }
      }
    }
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="🔄 Láminas Repetidas" subtitle={`${dupeCount} repetidas en total`} showBack />
        <div className="p-4 space-y-2">
          {allDupes.length === 0 ? (
            <p className="text-center text-gray-400 mt-8">No tienes láminas repetidas aún</p>
          ) : (
            allDupes.map((d) => (
              <div key={d.code} className="bg-white rounded-xl p-3 border flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-amber-500 text-white">{d.code}</span>
                    <span className="text-sm truncate">{d.label}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{d.sectionEmoji} {d.sectionName}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <button onClick={(e) => removeDupe(d.code, e)} className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg font-bold">−</button>
                  <span className="text-sm font-bold w-6 text-center text-amber-600">{d.count}</span>
                  <button onClick={(e) => addDupe(d.code, e)} className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-lg font-bold">+</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ─── Stats View ────────────────────────────────────────────────────
  if (view === "stats") {
    const teamSections = ALBUM_SECTIONS.filter((s) => s.id !== "intro" && s.id !== "history");
    const teamProgress = teamSections
      .map((s) => ({ name: s.name, emoji: s.emoji, ...sectionStats(s) }))
      .sort((a, b) => parseFloat(b.pct) - parseFloat(a.pct));
    const completed = teamProgress.filter((t) => parseInt(t.pct) === 100).length;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="📊 Estadísticas" showBack />
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border text-center">
              <p className="text-3xl font-black text-blue-900">{pct}%</p>
              <p className="text-xs text-gray-500">Completado</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border text-center">
              <p className="text-3xl font-black text-amber-600">{dupeCount}</p>
              <p className="text-xs text-gray-500">Repetidas</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border text-center">
              <p className="text-3xl font-black text-green-600">{completed}/48</p>
              <p className="text-xs text-gray-500">Equipos completos</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border text-center">
              <p className="text-3xl font-black text-red-500">{TOTAL_STICKERS - ownedCount}</p>
              <p className="text-xs text-gray-500">Faltan</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border pb-6">
            <h3 className="font-bold text-sm text-gray-500 uppercase mb-3">Ranking de Selecciones</h3>
            {teamProgress.map((t, i) => (
              <div key={t.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                  <span className="text-base">{t.emoji}</span>
                  <span className="text-sm truncate">{t.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">{t.have}/{t.total}</span>
                  <span className={`text-sm font-bold w-10 text-right ${parseInt(t.pct) === 100 ? "text-green-600" : "text-gray-500"}`}>
                    {t.pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
