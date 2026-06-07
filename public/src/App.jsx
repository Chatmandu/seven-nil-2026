import React, { useState, useEffect } from "react";

// ============================================================================
// 8-0 · WORLD CUP 2026 EDITION
// Spin a nation from this summer's tournament, draft one player from their
// starting XI (the rest of that squad is then locked away), fill your formation,
// and watch all eight matches play out. Stats are 2024-25 club-season form.
// ============================================================================

// 8-0 · 2026 edition. 24 nations, each a real best XI.
// Stats are 2024-25 club-season figures (g/a in all competitions, apps approximate).
// club = the player's club that season. ovr is a derived rating (form + standing).
// roles drive position eligibility; the full XI is shown each spin but locked once you pick.

const SQUADS = [
  { nation:"France", flag:"🇫🇷", conf:"UEFA", players:[
    { name:"Mike Maignan", club:"AC Milan", roles:["GK"], ovr:86, g:0, a:0, apps:36 },
    { name:"Jules Koundé", club:"Barcelona", roles:["RB","CB"], ovr:85, g:2, a:5, apps:44 },
    { name:"William Saliba", club:"Arsenal", roles:["CB"], ovr:87, g:2, a:1, apps:38 },
    { name:"Dayot Upamecano", club:"Bayern Munich", roles:["CB"], ovr:84, g:1, a:0, apps:31 },
    { name:"Theo Hernández", club:"AC Milan", roles:["LB","LWB"], ovr:84, g:3, a:6, apps:40 },
    { name:"Aurélien Tchouaméni", club:"Real Madrid", roles:["CDM","CM"], ovr:85, g:2, a:1, apps:43 },
    { name:"Eduardo Camavinga", club:"Real Madrid", roles:["CM","CDM"], ovr:84, g:1, a:3, apps:36 },
    { name:"Antoine Griezmann", club:"Atlético Madrid", roles:["CAM","ST"], ovr:86, g:16, a:8, apps:47 },
    { name:"Ousmane Dembélé", club:"Paris SG", roles:["RW","LW"], ovr:87, g:33, a:13, apps:49 },
    { name:"Kylian Mbappé", club:"Real Madrid", roles:["ST","LW"], ovr:91, g:43, a:9, apps:56 },
    { name:"Bradley Barcola", club:"Paris SG", roles:["LW","RW"], ovr:83, g:21, a:14, apps:51 },
  ]},
  { nation:"Brazil", flag:"🇧🇷", conf:"CONMEBOL", players:[
    { name:"Alisson", club:"Liverpool", roles:["GK"], ovr:88, g:0, a:0, apps:30 },
    { name:"Danilo", club:"Flamengo", roles:["RB","CB"], ovr:80, g:1, a:2, apps:34 },
    { name:"Marquinhos", club:"Paris SG", roles:["CB"], ovr:86, g:3, a:1, apps:42 },
    { name:"Gabriel Magalhães", club:"Arsenal", roles:["CB"], ovr:85, g:5, a:1, apps:39 },
    { name:"Wendell", club:"Porto", roles:["LB","LWB"], ovr:79, g:2, a:5, apps:40 },
    { name:"Bruno Guimarães", club:"Newcastle", roles:["CDM","CM"], ovr:85, g:4, a:7, apps:48 },
    { name:"Lucas Paquetá", club:"West Ham", roles:["CM","CAM"], ovr:82, g:5, a:6, apps:40 },
    { name:"Raphinha", club:"Barcelona", roles:["RW","LW"], ovr:88, g:34, a:25, apps:57 },
    { name:"Rodrygo", club:"Real Madrid", roles:["RW","LW"], ovr:85, g:14, a:9, apps:54 },
    { name:"Vinícius Júnior", club:"Real Madrid", roles:["LW","ST"], ovr:89, g:22, a:11, apps:55 },
    { name:"Matheus Cunha", club:"Wolves", roles:["ST","CAM"], ovr:82, g:17, a:6, apps:37 },
  ]},
  { nation:"Argentina", flag:"🇦🇷", conf:"CONMEBOL", players:[
    { name:"Emiliano Martínez", club:"Aston Villa", roles:["GK"], ovr:87, g:0, a:0, apps:48 },
    { name:"Nahuel Molina", club:"Atlético Madrid", roles:["RB","RWB"], ovr:81, g:2, a:4, apps:43 },
    { name:"Cristian Romero", club:"Tottenham", roles:["CB"], ovr:86, g:3, a:1, apps:35 },
    { name:"Lisandro Martínez", club:"Man United", roles:["CB","LB"], ovr:84, g:1, a:1, apps:28 },
    { name:"Nicolás Tagliafico", club:"Lyon", roles:["LB","LWB"], ovr:80, g:2, a:3, apps:42 },
    { name:"Enzo Fernández", club:"Chelsea", roles:["CM","CDM"], ovr:84, g:8, a:6, apps:49 },
    { name:"Alexis Mac Allister", club:"Liverpool", roles:["CM","CAM"], ovr:85, g:6, a:5, apps:47 },
    { name:"Rodrigo De Paul", club:"Atlético Madrid", roles:["CM","RM"], ovr:82, g:2, a:7, apps:46 },
    { name:"Lionel Messi", club:"Inter Miami", roles:["RW","CAM"], ovr:88, g:30, a:21, apps:41 },
    { name:"Lautaro Martínez", club:"Inter", roles:["ST"], ovr:87, g:21, a:5, apps:50 },
    { name:"Julián Álvarez", club:"Atlético Madrid", roles:["ST","CAM"], ovr:85, g:24, a:7, apps:54 },
  ]},
  { nation:"England", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", conf:"UEFA", players:[
    { name:"Jordan Pickford", club:"Everton", roles:["GK"], ovr:84, g:0, a:0, apps:37 },
    { name:"Trent Alexander-Arnold", club:"Real Madrid", roles:["RB","RWB"], ovr:85, g:3, a:9, apps:46 },
    { name:"John Stones", club:"Man City", roles:["CB"], ovr:84, g:1, a:1, apps:28 },
    { name:"Marc Guéhi", club:"Crystal Palace", roles:["CB"], ovr:83, g:2, a:0, apps:38 },
    { name:"Myles Lewis-Skelly", club:"Arsenal", roles:["LB","CM"], ovr:80, g:2, a:2, apps:31 },
    { name:"Declan Rice", club:"Arsenal", roles:["CDM","CM"], ovr:87, g:9, a:10, apps:51 },
    { name:"Jude Bellingham", club:"Real Madrid", roles:["CM","CAM"], ovr:88, g:15, a:13, apps:54 },
    { name:"Cole Palmer", club:"Chelsea", roles:["CAM","RW"], ovr:86, g:18, a:11, apps:48 },
    { name:"Bukayo Saka", club:"Arsenal", roles:["RW","LW"], ovr:86, g:9, a:11, apps:34 },
    { name:"Harry Kane", club:"Bayern Munich", roles:["ST"], ovr:89, g:36, a:12, apps:45 },
    { name:"Phil Foden", club:"Man City", roles:["LW","CAM"], ovr:85, g:10, a:7, apps:45 },
  ]},
  { nation:"Spain", flag:"🇪🇸", conf:"UEFA", players:[
    { name:"Unai Simón", club:"Athletic Bilbao", roles:["GK"], ovr:85, g:0, a:0, apps:42 },
    { name:"Pedro Porro", club:"Tottenham", roles:["RB","RWB"], ovr:82, g:6, a:8, apps:46 },
    { name:"Dean Huijsen", club:"Bournemouth", roles:["CB"], ovr:82, g:3, a:1, apps:34 },
    { name:"Pau Cubarsí", club:"Barcelona", roles:["CB"], ovr:83, g:1, a:1, apps:43 },
    { name:"Marc Cucurella", club:"Chelsea", roles:["LB","LWB"], ovr:83, g:3, a:4, apps:48 },
    { name:"Rodri", club:"Man City", roles:["CDM","CM"], ovr:90, g:2, a:2, apps:20 },
    { name:"Pedri", club:"Barcelona", roles:["CM","CAM"], ovr:87, g:6, a:8, apps:54 },
    { name:"Fabián Ruiz", club:"Paris SG", roles:["CM","CAM"], ovr:84, g:7, a:9, apps:50 },
    { name:"Lamine Yamal", club:"Barcelona", roles:["RW","LW"], ovr:88, g:18, a:25, apps:55 },
    { name:"Nico Williams", club:"Athletic Bilbao", roles:["LW","RW"], ovr:84, g:11, a:9, apps:45 },
    { name:"Mikel Oyarzabal", club:"Real Sociedad", roles:["ST","LW"], ovr:83, g:15, a:6, apps:46 },
  ]},
  { nation:"Germany", flag:"🇩🇪", conf:"UEFA", players:[
    { name:"Marc-André ter Stegen", club:"Barcelona", roles:["GK"], ovr:85, g:0, a:0, apps:9 },
    { name:"Joshua Kimmich", club:"Bayern Munich", roles:["RB","CDM"], ovr:86, g:3, a:13, apps:48 },
    { name:"Antonio Rüdiger", club:"Real Madrid", roles:["CB"], ovr:86, g:3, a:1, apps:46 },
    { name:"Jonathan Tah", club:"Bayer Leverkusen", roles:["CB"], ovr:83, g:2, a:1, apps:42 },
    { name:"David Raum", club:"RB Leipzig", roles:["LB","LWB"], ovr:81, g:2, a:9, apps:43 },
    { name:"Robert Andrich", club:"Bayer Leverkusen", roles:["CDM","CM"], ovr:81, g:3, a:4, apps:44 },
    { name:"Florian Wirtz", club:"Bayer Leverkusen", roles:["CAM","CM"], ovr:88, g:16, a:15, apps:45 },
    { name:"Jamal Musiala", club:"Bayern Munich", roles:["CAM","RW"], ovr:87, g:12, a:7, apps:36 },
    { name:"Leroy Sané", club:"Bayern Munich", roles:["RW","LW"], ovr:83, g:11, a:11, apps:45 },
    { name:"Kai Havertz", club:"Arsenal", roles:["ST","CAM"], ovr:84, g:15, a:6, apps:37 },
    { name:"Serge Gnabry", club:"Bayern Munich", roles:["LW","ST"], ovr:81, g:13, a:5, apps:42 },
  ]},
  { nation:"Portugal", flag:"🇵🇹", conf:"UEFA", players:[
    { name:"Diogo Costa", club:"Porto", roles:["GK"], ovr:84, g:0, a:0, apps:44 },
    { name:"João Cancelo", club:"Al-Hilal", roles:["RB","LB"], ovr:83, g:5, a:8, apps:42 },
    { name:"Rúben Dias", club:"Man City", roles:["CB"], ovr:86, g:1, a:2, apps:46 },
    { name:"Gonçalo Inácio", club:"Sporting CP", roles:["CB"], ovr:82, g:4, a:2, apps:43 },
    { name:"Nuno Mendes", club:"Paris SG", roles:["LB","LWB"], ovr:84, g:4, a:7, apps:48 },
    { name:"Vitinha", club:"Paris SG", roles:["CM","CDM"], ovr:86, g:7, a:9, apps:53 },
    { name:"Bruno Fernandes", club:"Man United", roles:["CAM","CM"], ovr:87, g:19, a:18, apps:57 },
    { name:"Bernardo Silva", club:"Man City", roles:["RW","CAM"], ovr:85, g:6, a:9, apps:50 },
    { name:"Rafael Leão", club:"AC Milan", roles:["LW","ST"], ovr:84, g:12, a:9, apps:49 },
    { name:"Cristiano Ronaldo", club:"Al-Nassr", roles:["ST"], ovr:84, g:35, a:4, apps:45 },
    { name:"Pedro Neto", club:"Chelsea", roles:["RW","LW"], ovr:81, g:8, a:7, apps:46 },
  ]},
  { nation:"Netherlands", flag:"🇳🇱", conf:"UEFA", players:[
    { name:"Bart Verbruggen", club:"Brighton", roles:["GK"], ovr:82, g:0, a:0, apps:38 },
    { name:"Denzel Dumfries", club:"Inter", roles:["RB","RWB"], ovr:83, g:7, a:6, apps:46 },
    { name:"Virgil van Dijk", club:"Liverpool", roles:["CB"], ovr:88, g:4, a:2, apps:50 },
    { name:"Stefan de Vrij", club:"Inter", roles:["CB"], ovr:81, g:2, a:0, apps:38 },
    { name:"Nathan Aké", club:"Man City", roles:["LB","CB"], ovr:82, g:2, a:1, apps:30 },
    { name:"Frenkie de Jong", club:"Barcelona", roles:["CM","CDM"], ovr:85, g:2, a:4, apps:43 },
    { name:"Tijjani Reijnders", club:"AC Milan", roles:["CM","CAM"], ovr:84, g:10, a:7, apps:51 },
    { name:"Ryan Gravenberch", club:"Liverpool", roles:["CDM","CM"], ovr:83, g:3, a:5, apps:51 },
    { name:"Cody Gakpo", club:"Liverpool", roles:["LW","ST"], ovr:84, g:18, a:8, apps:49 },
    { name:"Memphis Depay", club:"Corinthians", roles:["ST","CAM"], ovr:81, g:14, a:11, apps:43 },
    { name:"Xavi Simons", club:"RB Leipzig", roles:["CAM","RW"], ovr:84, g:11, a:9, apps:48 },
  ]},
  { nation:"Belgium", flag:"🇧🇪", conf:"UEFA", players:[
    { name:"Thibaut Courtois", club:"Real Madrid", roles:["GK"], ovr:88, g:0, a:0, apps:42 },
    { name:"Timothy Castagne", club:"Fulham", roles:["RB","RWB"], ovr:79, g:1, a:3, apps:37 },
    { name:"Wout Faes", club:"Leicester", roles:["CB"], ovr:78, g:2, a:0, apps:36 },
    { name:"Zeno Debast", club:"Sporting CP", roles:["CB"], ovr:79, g:1, a:2, apps:40 },
    { name:"Maxim De Cuyper", club:"Club Brugge", roles:["LB","LWB"], ovr:78, g:3, a:6, apps:44 },
    { name:"Amadou Onana", club:"Aston Villa", roles:["CDM","CM"], ovr:82, g:3, a:1, apps:42 },
    { name:"Youri Tielemans", club:"Aston Villa", roles:["CM","CAM"], ovr:83, g:6, a:8, apps:50 },
    { name:"Kevin De Bruyne", club:"Man City", roles:["CAM","CM"], ovr:86, g:8, a:14, apps:43 },
    { name:"Jérémy Doku", club:"Man City", roles:["RW","LW"], ovr:82, g:5, a:9, apps:45 },
    { name:"Romelu Lukaku", club:"Napoli", roles:["ST"], ovr:84, g:18, a:9, apps:46 },
    { name:"Leandro Trossard", club:"Arsenal", roles:["LW","ST"], ovr:82, g:11, a:7, apps:50 },
  ]},
  { nation:"Norway", flag:"🇳🇴", conf:"UEFA", players:[
    { name:"Ørjan Nyland", club:"Sevilla", roles:["GK"], ovr:78, g:0, a:0, apps:34 },
    { name:"Julian Ryerson", club:"Borussia Dortmund", roles:["RB","LB"], ovr:80, g:2, a:5, apps:44 },
    { name:"Kristoffer Ajer", club:"Brentford", roles:["CB","RB"], ovr:79, g:1, a:1, apps:38 },
    { name:"Leo Østigård", club:"Rennes", roles:["CB"], ovr:78, g:3, a:0, apps:40 },
    { name:"David Møller Wolfe", club:"AZ Alkmaar", roles:["LB","LWB"], ovr:76, g:1, a:4, apps:40 },
    { name:"Sander Berge", club:"Fulham", roles:["CM","CDM"], ovr:80, g:3, a:3, apps:46 },
    { name:"Martin Ødegaard", club:"Arsenal", roles:["CAM","CM"], ovr:86, g:9, a:11, apps:43 },
    { name:"Fredrik Aursnes", club:"Benfica", roles:["CM","RM"], ovr:80, g:6, a:7, apps:50 },
    { name:"Antonio Nusa", club:"RB Leipzig", roles:["LW","RW"], ovr:80, g:8, a:6, apps:42 },
    { name:"Erling Haaland", club:"Man City", roles:["ST"], ovr:90, g:34, a:5, apps:45 },
    { name:"Alexander Sørloth", club:"Atlético Madrid", roles:["ST","LW"], ovr:82, g:20, a:5, apps:48 },
  ]},
  { nation:"Uruguay", flag:"🇺🇾", conf:"CONMEBOL", players:[
    { name:"Sergio Rochet", club:"Internacional", roles:["GK"], ovr:79, g:0, a:0, apps:38 },
    { name:"Nahitan Nández", club:"Al-Qadsiah", roles:["RB","CDM"], ovr:79, g:1, a:3, apps:40 },
    { name:"Ronald Araújo", club:"Barcelona", roles:["CB"], ovr:84, g:2, a:1, apps:33 },
    { name:"José María Giménez", club:"Atlético Madrid", roles:["CB"], ovr:83, g:2, a:1, apps:40 },
    { name:"Mathías Olivera", club:"Napoli", roles:["LB","LWB"], ovr:80, g:2, a:3, apps:42 },
    { name:"Manuel Ugarte", club:"Man United", roles:["CDM","CM"], ovr:81, g:1, a:2, apps:40 },
    { name:"Federico Valverde", club:"Real Madrid", roles:["CM","RM"], ovr:88, g:9, a:11, apps:56 },
    { name:"Nicolás de la Cruz", club:"Flamengo", roles:["CAM","CM"], ovr:81, g:7, a:9, apps:48 },
    { name:"Facundo Pellistri", club:"Panathinaikos", roles:["RW","LW"], ovr:78, g:6, a:5, apps:42 },
    { name:"Darwin Núñez", club:"Liverpool", roles:["ST"], ovr:83, g:12, a:6, apps:47 },
    { name:"Federico Viñas", club:"León", roles:["ST"], ovr:77, g:13, a:3, apps:40 },
  ]},
  { nation:"Croatia", flag:"🇭🇷", conf:"UEFA", players:[
    { name:"Dominik Livaković", club:"Fenerbahçe", roles:["GK"], ovr:81, g:0, a:0, apps:38 },
    { name:"Josip Stanišić", club:"Bayern Munich", roles:["RB","CB"], ovr:80, g:2, a:3, apps:38 },
    { name:"Joško Gvardiol", club:"Man City", roles:["CB","LB"], ovr:85, g:5, a:3, apps:49 },
    { name:"Joško Šutalo", club:"Ajax", roles:["CB"], ovr:78, g:1, a:1, apps:40 },
    { name:"Borna Sosa", club:"Ajax", roles:["LB","LWB"], ovr:78, g:1, a:5, apps:36 },
    { name:"Luka Modrić", club:"Real Madrid", roles:["CM","CAM"], ovr:84, g:3, a:5, apps:51 },
    { name:"Mateo Kovačić", club:"Man City", roles:["CM","CDM"], ovr:83, g:4, a:5, apps:43 },
    { name:"Marcelo Brozović", club:"Al-Nassr", roles:["CDM","CM"], ovr:81, g:6, a:5, apps:42 },
    { name:"Ivan Perišić", club:"PSV", roles:["LW","LWB"], ovr:80, g:13, a:11, apps:46 },
    { name:"Andrej Kramarić", club:"Hoffenheim", roles:["ST","CAM"], ovr:80, g:14, a:6, apps:43 },
    { name:"Ante Budimir", club:"Osasuna", roles:["ST"], ovr:79, g:21, a:2, apps:45 },
  ]},
  { nation:"USA", flag:"🇺🇸", conf:"CONCACAF", players:[
    { name:"Matt Turner", club:"Crystal Palace", roles:["GK"], ovr:78, g:0, a:0, apps:12 },
    { name:"Sergiño Dest", club:"PSV", roles:["RB","RWB"], ovr:80, g:2, a:6, apps:38 },
    { name:"Chris Richards", club:"Crystal Palace", roles:["CB"], ovr:80, g:4, a:1, apps:38 },
    { name:"Tim Ream", club:"Charlotte FC", roles:["CB","LB"], ovr:77, g:1, a:1, apps:40 },
    { name:"Antonee Robinson", club:"Fulham", roles:["LB","LWB"], ovr:82, g:2, a:10, apps:38 },
    { name:"Tyler Adams", club:"Bournemouth", roles:["CDM","CM"], ovr:80, g:1, a:2, apps:39 },
    { name:"Weston McKennie", club:"Juventus", roles:["CM","CAM"], ovr:81, g:5, a:5, apps:48 },
    { name:"Yunus Musah", club:"AC Milan", roles:["CM","RM"], ovr:79, g:1, a:2, apps:46 },
    { name:"Christian Pulisic", club:"AC Milan", roles:["RW","LW"], ovr:84, g:17, a:11, apps:48 },
    { name:"Folarin Balogun", club:"Monaco", roles:["ST"], ovr:80, g:10, a:4, apps:40 },
    { name:"Timothy Weah", club:"Juventus", roles:["RW","RB"], ovr:79, g:4, a:6, apps:46 },
  ]},
  { nation:"Mexico", flag:"🇲🇽", conf:"CONCACAF", players:[
    { name:"Luis Malagón", club:"América", roles:["GK"], ovr:79, g:0, a:0, apps:42 },
    { name:"Jorge Sánchez", club:"Cruz Azul", roles:["RB","RWB"], ovr:76, g:1, a:3, apps:38 },
    { name:"César Montes", club:"Lokomotiv Moscow", roles:["CB"], ovr:78, g:3, a:1, apps:42 },
    { name:"Johan Vásquez", club:"Genoa", roles:["CB","LB"], ovr:79, g:3, a:1, apps:44 },
    { name:"Jesús Gallardo", club:"Toluca", roles:["LB","LWB"], ovr:77, g:2, a:6, apps:44 },
    { name:"Edson Álvarez", club:"West Ham", roles:["CDM","CM"], ovr:81, g:1, a:1, apps:42 },
    { name:"Luis Romo", club:"Cruz Azul", roles:["CM","CDM"], ovr:78, g:3, a:4, apps:44 },
    { name:"Orbelín Pineda", club:"AEK Athens", roles:["CAM","CM"], ovr:79, g:9, a:11, apps:48 },
    { name:"Alexis Vega", club:"Toluca", roles:["RW","ST"], ovr:79, g:14, a:10, apps:46 },
    { name:"Santiago Giménez", club:"AC Milan", roles:["ST"], ovr:81, g:13, a:3, apps:46 },
    { name:"Hirving Lozano", club:"San Diego FC", roles:["LW","RW"], ovr:80, g:9, a:7, apps:38 },
  ]},
  { nation:"Colombia", flag:"🇨🇴", conf:"CONMEBOL", players:[
    { name:"Camilo Vargas", club:"Atlas", roles:["GK"], ovr:79, g:0, a:0, apps:42 },
    { name:"Daniel Muñoz", club:"Crystal Palace", roles:["RB","RWB"], ovr:81, g:5, a:4, apps:48 },
    { name:"Dávinson Sánchez", club:"Galatasaray", roles:["CB"], ovr:81, g:3, a:1, apps:44 },
    { name:"Yerry Mina", club:"Cagliari", roles:["CB"], ovr:78, g:4, a:0, apps:36 },
    { name:"Johan Mojica", club:"Mallorca", roles:["LB","LWB"], ovr:78, g:1, a:4, apps:40 },
    { name:"Richard Ríos", club:"Palmeiras", roles:["CDM","CM"], ovr:80, g:4, a:3, apps:50 },
    { name:"Jefferson Lerma", club:"Crystal Palace", roles:["CDM","CM"], ovr:80, g:2, a:2, apps:42 },
    { name:"James Rodríguez", club:"León", roles:["CAM","RW"], ovr:82, g:6, a:13, apps:38 },
    { name:"Luis Díaz", club:"Liverpool", roles:["LW","ST"], ovr:85, g:17, a:8, apps:50 },
    { name:"Jhon Durán", club:"Al-Nassr", roles:["ST"], ovr:80, g:14, a:3, apps:40 },
    { name:"Jhon Arias", club:"Wolves", roles:["RW","CAM"], ovr:80, g:9, a:11, apps:50 },
  ]},
  { nation:"Morocco", flag:"🇲🇦", conf:"CAF", players:[
    { name:"Yassine Bounou", club:"Al-Hilal", roles:["GK"], ovr:84, g:0, a:0, apps:38 },
    { name:"Achraf Hakimi", club:"Paris SG", roles:["RB","RWB"], ovr:86, g:11, a:9, apps:51 },
    { name:"Nayef Aguerd", club:"Real Sociedad", roles:["CB"], ovr:81, g:2, a:0, apps:36 },
    { name:"Romain Saïss", club:"Al-Shabab", roles:["CB"], ovr:79, g:2, a:0, apps:38 },
    { name:"Noussair Mazraoui", club:"Man United", roles:["LB","RB"], ovr:81, g:2, a:3, apps:44 },
    { name:"Sofyan Amrabat", club:"Fenerbahçe", roles:["CDM","CM"], ovr:80, g:1, a:2, apps:38 },
    { name:"Azzedine Ounahi", club:"Girona", roles:["CM","CAM"], ovr:80, g:5, a:4, apps:42 },
    { name:"Brahim Díaz", club:"Real Madrid", roles:["CAM","RW"], ovr:82, g:8, a:7, apps:48 },
    { name:"Hakim Ziyech", club:"Al-Duhail", roles:["RW","CAM"], ovr:79, g:6, a:8, apps:36 },
    { name:"Youssef En-Nesyri", club:"Fenerbahçe", roles:["ST"], ovr:81, g:23, a:5, apps:48 },
    { name:"Sofiane Boufal", club:"Al-Rayyan", roles:["LW","RW"], ovr:78, g:7, a:6, apps:38 },
  ]},
  { nation:"Japan", flag:"🇯🇵", conf:"AFC", players:[
    { name:"Zion Suzuki", club:"Parma", roles:["GK"], ovr:80, g:0, a:0, apps:36 },
    { name:"Hiroki Sakai", club:"Cerezo Osaka", roles:["RB","RWB"], ovr:76, g:1, a:3, apps:34 },
    { name:"Ko Itakura", club:"Borussia M'gladbach", roles:["CB"], ovr:80, g:3, a:1, apps:40 },
    { name:"Takehiro Tomiyasu", club:"Arsenal", roles:["CB","RB"], ovr:80, g:1, a:1, apps:18 },
    { name:"Hiroki Ito", club:"Bayern Munich", roles:["LB","CB"], ovr:79, g:1, a:1, apps:22 },
    { name:"Wataru Endō", club:"Liverpool", roles:["CDM","CM"], ovr:80, g:2, a:1, apps:38 },
    { name:"Hidemasa Morita", club:"Sporting CP", roles:["CM","CDM"], ovr:80, g:2, a:4, apps:44 },
    { name:"Takefusa Kubo", club:"Real Sociedad", roles:["RW","CAM"], ovr:83, g:9, a:7, apps:48 },
    { name:"Kaoru Mitoma", club:"Brighton", roles:["LW","ST"], ovr:83, g:10, a:6, apps:44 },
    { name:"Daizen Maeda", club:"Celtic", roles:["ST","LW"], ovr:80, g:24, a:7, apps:50 },
    { name:"Takumi Minamino", club:"Monaco", roles:["CAM","LW"], ovr:79, g:8, a:6, apps:44 },
  ]},
  { nation:"Senegal", flag:"🇸🇳", conf:"CAF", players:[
    { name:"Édouard Mendy", club:"Al-Ahli", roles:["GK"], ovr:82, g:0, a:0, apps:38 },
    { name:"Krépin Diatta", club:"Monaco", roles:["RB","RW"], ovr:79, g:3, a:5, apps:44 },
    { name:"Kalidou Koulibaly", club:"Al-Hilal", roles:["CB"], ovr:82, g:2, a:1, apps:40 },
    { name:"Abdou Diallo", club:"Al-Arabi", roles:["CB","LB"], ovr:78, g:1, a:1, apps:38 },
    { name:"Ismail Jakobs", club:"Galatasaray", roles:["LB","LWB"], ovr:78, g:1, a:5, apps:40 },
    { name:"Pape Matar Sarr", club:"Tottenham", roles:["CM","CDM"], ovr:81, g:4, a:3, apps:46 },
    { name:"Idrissa Gueye", club:"Everton", roles:["CDM","CM"], ovr:80, g:3, a:2, apps:42 },
    { name:"Pape Gueye", club:"Villarreal", roles:["CM","CDM"], ovr:79, g:2, a:2, apps:40 },
    { name:"Ismaïla Sarr", club:"Crystal Palace", roles:["RW","LW"], ovr:81, g:12, a:5, apps:48 },
    { name:"Nicolas Jackson", club:"Chelsea", roles:["ST"], ovr:81, g:13, a:5, apps:42 },
    { name:"Sadio Mané", club:"Al-Nassr", roles:["LW","ST"], ovr:83, g:18, a:11, apps:46 },
  ]},
  { nation:"Switzerland", flag:"🇨🇭", conf:"UEFA", players:[
    { name:"Yann Sommer", club:"Inter", roles:["GK"], ovr:84, g:0, a:0, apps:46 },
    { name:"Silvan Widmer", club:"Mainz", roles:["RB","RWB"], ovr:77, g:2, a:4, apps:42 },
    { name:"Manuel Akanji", club:"Man City", roles:["CB"], ovr:84, g:1, a:1, apps:44 },
    { name:"Nico Elvedi", club:"Borussia M'gladbach", roles:["CB"], ovr:78, g:2, a:1, apps:40 },
    { name:"Ricardo Rodríguez", club:"Real Betis", roles:["LB","LWB"], ovr:77, g:1, a:3, apps:36 },
    { name:"Remo Freuler", club:"Bologna", roles:["CDM","CM"], ovr:80, g:3, a:3, apps:46 },
    { name:"Granit Xhaka", club:"Bayer Leverkusen", roles:["CM","CDM"], ovr:84, g:3, a:8, apps:48 },
    { name:"Xherdan Shaqiri", club:"FC Basel", roles:["CAM","RW"], ovr:78, g:14, a:13, apps:42 },
    { name:"Dan Ndoye", club:"Bologna", roles:["RW","LW"], ovr:80, g:7, a:6, apps:46 },
    { name:"Breel Embolo", club:"Monaco", roles:["ST"], ovr:80, g:11, a:5, apps:42 },
    { name:"Ruben Vargas", club:"Sevilla", roles:["LW","ST"], ovr:79, g:8, a:7, apps:40 },
  ]},
  { nation:"Austria", flag:"🇦🇹", conf:"UEFA", players:[
    { name:"Alexander Schlager", club:"RB Salzburg", roles:["GK"], ovr:79, g:0, a:0, apps:38 },
    { name:"Stefan Posch", club:"Bologna", roles:["RB","CB"], ovr:78, g:2, a:3, apps:40 },
    { name:"Kevin Danso", club:"Tottenham", roles:["CB"], ovr:80, g:1, a:1, apps:36 },
    { name:"David Alaba", club:"Real Madrid", roles:["CB","LB"], ovr:82, g:2, a:3, apps:24 },
    { name:"Philipp Mwene", club:"Mainz", roles:["LB","RB"], ovr:76, g:1, a:4, apps:40 },
    { name:"Konrad Laimer", club:"Bayern Munich", roles:["CM","RB"], ovr:82, g:4, a:5, apps:48 },
    { name:"Nicolas Seiwald", club:"RB Leipzig", roles:["CDM","CM"], ovr:80, g:1, a:3, apps:44 },
    { name:"Marcel Sabitzer", club:"Borussia Dortmund", roles:["CM","CAM"], ovr:83, g:9, a:10, apps:46 },
    { name:"Christoph Baumgartner", club:"RB Leipzig", roles:["CAM","RW"], ovr:81, g:13, a:6, apps:45 },
    { name:"Marko Arnautović", club:"Red Star Belgrade", roles:["ST"], ovr:79, g:16, a:7, apps:40 },
    { name:"Patrick Wimmer", club:"Wolfsburg", roles:["LW","RW"], ovr:78, g:7, a:8, apps:42 },
  ]},
  { nation:"Ecuador", flag:"🇪🇨", conf:"CONMEBOL", players:[
    { name:"Hernán Galíndez", club:"Huracán", roles:["GK"], ovr:77, g:0, a:0, apps:36 },
    { name:"Ángelo Preciado", club:"Sparta Prague", roles:["RB","RWB"], ovr:77, g:2, a:4, apps:40 },
    { name:"Piero Hincapié", club:"Bayer Leverkusen", roles:["CB","LB"], ovr:82, g:2, a:2, apps:44 },
    { name:"Willian Pacho", club:"Paris SG", roles:["CB"], ovr:82, g:2, a:1, apps:50 },
    { name:"Pervis Estupiñán", club:"AC Milan", roles:["LB","LWB"], ovr:81, g:2, a:6, apps:42 },
    { name:"Moisés Caicedo", club:"Chelsea", roles:["CDM","CM"], ovr:85, g:4, a:3, apps:50 },
    { name:"Alan Franco", club:"Atlético Mineiro", roles:["CM","CDM"], ovr:78, g:2, a:2, apps:44 },
    { name:"Jeremy Sarmiento", club:"Burnley", roles:["RW","LW"], ovr:77, g:4, a:4, apps:38 },
    { name:"Kendry Páez", club:"Independiente del Valle", roles:["CAM","CM"], ovr:78, g:8, a:7, apps:40 },
    { name:"Enner Valencia", club:"Internacional", roles:["ST"], ovr:79, g:13, a:5, apps:44 },
    { name:"Kevin Rodríguez", club:"Union SG", roles:["ST","LW"], ovr:77, g:11, a:4, apps:42 },
  ]},
  { nation:"Ivory Coast", flag:"🇨🇮", conf:"CAF", players:[
    { name:"Yahia Fofana", club:"Angers", roles:["GK"], ovr:77, g:0, a:0, apps:34 },
    { name:"Wilfried Singo", club:"Monaco", roles:["RB","RWB"], ovr:81, g:2, a:4, apps:44 },
    { name:"Evan Ndicka", club:"Roma", roles:["CB","LB"], ovr:81, g:2, a:1, apps:46 },
    { name:"Odilon Kossounou", club:"Atalanta", roles:["CB"], ovr:79, g:1, a:1, apps:38 },
    { name:"Ghislain Konan", club:"Reims", roles:["LB","LWB"], ovr:76, g:1, a:4, apps:40 },
    { name:"Franck Kessié", club:"Al-Ahli", roles:["CM","CDM"], ovr:82, g:8, a:5, apps:44 },
    { name:"Ibrahim Sangaré", club:"Nottingham Forest", roles:["CDM","CM"], ovr:80, g:2, a:2, apps:42 },
    { name:"Simon Adingra", club:"Monaco", roles:["LW","RW"], ovr:80, g:9, a:7, apps:46 },
    { name:"Amad Diallo", club:"Man United", roles:["RW","CAM"], ovr:82, g:12, a:9, apps:48 },
    { name:"Evann Guessand", club:"Crystal Palace", roles:["ST","RW"], ovr:80, g:14, a:6, apps:44 },
    { name:"Nicolas Pépé", club:"Villarreal", roles:["RW","LW"], ovr:79, g:10, a:7, apps:42 },
  ]},
  { nation:"South Korea", flag:"🇰🇷", conf:"AFC", players:[
    { name:"Kim Seung-gyu", club:"Al-Shabab", roles:["GK"], ovr:78, g:0, a:0, apps:36 },
    { name:"Kim Moon-hwan", club:"Jeonbuk", roles:["RB","RWB"], ovr:75, g:1, a:4, apps:38 },
    { name:"Kim Min-jae", club:"Bayern Munich", roles:["CB"], ovr:84, g:2, a:1, apps:42 },
    { name:"Kim Young-gwon", club:"Ulsan", roles:["CB"], ovr:76, g:2, a:0, apps:38 },
    { name:"Kim Jin-su", club:"Jeonbuk", roles:["LB","LWB"], ovr:76, g:1, a:5, apps:40 },
    { name:"Hwang In-beom", club:"Feyenoord", roles:["CM","CDM"], ovr:80, g:4, a:6, apps:46 },
    { name:"Park Yong-woo", club:"Al-Ain", roles:["CDM","CM"], ovr:77, g:2, a:2, apps:40 },
    { name:"Lee Jae-sung", club:"Mainz", roles:["CAM","CM"], ovr:80, g:8, a:6, apps:46 },
    { name:"Hwang Hee-chan", club:"Wolves", roles:["RW","ST"], ovr:80, g:6, a:4, apps:42 },
    { name:"Son Heung-min", club:"Tottenham", roles:["LW","ST"], ovr:85, g:11, a:12, apps:48 },
    { name:"Oh Hyeon-gyu", club:"Genk", roles:["ST"], ovr:78, g:14, a:4, apps:44 },
  ]},
  { nation:"Paraguay", flag:"🇵🇾", conf:"CONMEBOL", players:[
    { name:"Roberto Fernández", club:"Belgrano", roles:["GK"], ovr:76, g:0, a:0, apps:34 },
    { name:"Gustavo Velázquez", club:"Olimpia", roles:["RB","CB"], ovr:74, g:1, a:2, apps:38 },
    { name:"Gustavo Gómez", club:"Palmeiras", roles:["CB"], ovr:80, g:6, a:1, apps:46 },
    { name:"Omar Alderete", club:"Sunderland", roles:["CB","LB"], ovr:78, g:2, a:1, apps:42 },
    { name:"Junior Alonso", club:"Atlético Mineiro", roles:["LB","CB"], ovr:77, g:1, a:2, apps:40 },
    { name:"Andrés Cubas", club:"Vancouver Whitecaps", roles:["CDM","CM"], ovr:78, g:1, a:2, apps:42 },
    { name:"Diego Gómez", club:"Brighton", roles:["CM","CAM"], ovr:79, g:7, a:5, apps:44 },
    { name:"Damián Bobadilla", club:"São Paulo", roles:["CM","CDM"], ovr:77, g:3, a:3, apps:42 },
    { name:"Miguel Almirón", club:"Atlanta United", roles:["RW","CAM"], ovr:80, g:11, a:8, apps:46 },
    { name:"Antonio Sanabria", club:"Cremonese", roles:["ST"], ovr:78, g:12, a:5, apps:44 },
    { name:"Julio Enciso", club:"Strasbourg", roles:["CAM","LW"], ovr:79, g:8, a:6, apps:40 },
  ]},
];

const FORMATIONS = {
  // ordered slot codes, def -> attack. Layout coords defined in the UI.
  "4-3-3":   ["GK","RB","RCB","LCB","LB","CDM","RCM","LCM","RW","ST","LW"],
  "4-4-2":   ["GK","RB","RCB","LCB","LB","RM","CDM","RCM","LM","ST","ST2"],
  "4-2-3-1": ["GK","RB","RCB","LCB","LB","CDM","CDM2","CAM","RW","LW","ST"],
  "4-5-1":   ["GK","RB","RCB","LCB","LB","RM","RCM","CDM","LCM","LM","ST"],
  "3-4-3":   ["GK","RCB","CB","LCB","RM","RCM","LCM","LM","RW","ST","LW"],
  "3-5-2":   ["GK","RCB","CB","LCB","RWB","RCM","CM","LCM","LWB","ST","ST2"],
  "5-4-1":   ["GK","RB","RCB","CB","LCB","LB","RM","RCM","LCM","LM","ST"],
};


const POS_GROUPS = { GK:"GK", RB:"DEF", LB:"DEF", RWB:"DEF", LWB:"DEF", RCB:"DEF", LCB:"DEF", CB:"DEF",
  CDM:"MID", CDM2:"MID", RCM:"MID", LCM:"MID", CM:"MID", RM:"MID", LM:"MID", CAM:"MID",
  RW:"FWD", LW:"FWD", ST:"FWD", ST2:"FWD" };
const SLOT_GROUP = (c) => POS_GROUPS[c] || "MID";

// Widened, realistic eligibility
const SLOT_ELIG = {
  GK:["GK"],
  RB:["RB","RWB"], LB:["LB","LWB"], RWB:["RWB","RB","RM","RW"], LWB:["LWB","LB","LM","LW"],
  RCB:["CB"], LCB:["CB"], CB:["CB"],
  CDM:["CDM","CM"], CDM2:["CDM","CM"],
  RCM:["CM","CAM","CDM"], LCM:["CM","CAM","CDM"], CM:["CM","CAM","CDM"],
  RM:["RM","RW","RWB","RB","CM"], LM:["LM","LW","LWB","LB","CM"],
  CAM:["CAM","CM"],
  RW:["RW","RM","LW","ST"], LW:["LW","LM","RW","ST"],
  ST:["ST","CAM"], ST2:["ST","CAM","RW","LW"],
};
const SLOT_NAME = {
  GK:"Goalkeeper", RB:"Right Back", LB:"Left Back", RWB:"Right Wing-Back", LWB:"Left Wing-Back",
  RCB:"Centre Back", LCB:"Centre Back", CB:"Centre Back",
  CDM:"Defensive Mid", CDM2:"Defensive Mid", RCM:"Centre Mid", LCM:"Centre Mid", CM:"Centre Mid",
  RM:"Right Mid", LM:"Left Mid", CAM:"Attacking Mid", RW:"Right Wing", LW:"Left Wing", ST:"Striker", ST2:"Striker",
};
const POS_TAG = { GK:"GK", RB:"RB", LB:"LB", RWB:"RWB", LWB:"LWB", RCB:"CB", LCB:"CB", CB:"CB",
  CDM:"CDM", CDM2:"CDM", RCM:"CM", LCM:"CM", CM:"CM", RM:"RM", LM:"LM", CAM:"CAM", RW:"RW", LW:"LW", ST:"ST", ST2:"ST" };

// Formation taglines (from the reference designs)
const FORMATION_INFO = {
  "4-3-3":   "Attacking with width. Three forwards create constant threat.",
  "4-4-2":   "The classic. Balanced, reliable, and compact.",
  "4-2-3-1": "Double pivot shields defence, attacking trio behind a lone striker.",
  "4-5-1":   "Midfield dominance. Overload the middle and counter.",
  "3-4-3":   "Three attackers supported by an industrious midfield four.",
  "3-5-2":   "Wing-backs provide width, two strikers share the load.",
  "5-4-1":   "Defensive fortress. Absorb pressure and strike on the break.",
};

// Pitch coordinates per formation (x: 0-100 left-right, y: 0 attack -> 100 defence).
// Mirrors the uploaded layouts.
const LAYOUT = {
  "4-3-3":   { ST:[50,12], LW:[18,20], RW:[82,20], RCM:[68,42], CDM:[50,50], LCM:[32,42], LB:[15,72], LCB:[38,75], RCB:[62,75], RB:[85,72], GK:[50,90] },
  "4-4-2":   { ST:[38,12], ST2:[62,12], LM:[15,45], CDM:[40,48], RCM:[60,48], RM:[85,45], LB:[15,75], LCB:[40,77], RCB:[60,77], RB:[85,75], GK:[50,90] },
  "4-2-3-1": { ST:[50,10], CAM:[50,30], LW:[18,30], RW:[82,30], CDM:[38,52], CDM2:[62,52], LB:[15,75], LCB:[40,77], RCB:[60,77], RB:[85,75], GK:[50,90] },
  "4-5-1":   { ST:[50,12], LM:[15,42], LCM:[35,48], CDM:[50,55], RCM:[65,48], RM:[85,42], LB:[15,75], LCB:[40,77], RCB:[60,77], RB:[85,75], GK:[50,90] },
  "3-4-3":   { ST:[50,12], LW:[20,18], RW:[80,18], LM:[15,46], LCM:[40,48], RCM:[60,48], RM:[85,46], LCB:[30,76], CB:[50,79], RCB:[70,76], GK:[50,92] },
  "3-5-2":   { ST:[40,14], ST2:[60,14], CM:[50,38], LCM:[33,46], RCM:[67,46], LWB:[12,52], RWB:[88,52], LCB:[30,76], CB:[50,79], RCB:[70,76], GK:[50,92] },
  "5-4-1":   { ST:[50,12], LM:[15,42], LCM:[38,46], RCM:[62,46], RM:[85,42], LB:[12,72], LCB:[32,77], CB:[50,80], RCB:[68,77], RB:[88,72], GK:[50,92] },
};

function formationSlots(formation) { return FORMATIONS[formation].map((code) => ({ code, player: null })); }
function eligible(player, slotCode) { const e = SLOT_ELIG[slotCode] || []; return player.roles.some((r) => e.includes(r)); }

const LEGENDARY_PAIRS = [
  ["Vinícius Júnior","Raphinha"], ["Lamine Yamal","Pedri"], ["Kylian Mbappé","Ousmane Dembélé"],
  ["Jude Bellingham","Harry Kane"], ["Lionel Messi","Lautaro Martínez"], ["Florian Wirtz","Jamal Musiala"],
  ["Bruno Fernandes","Rafael Leão"], ["Bukayo Saka","Cole Palmer"], ["Virgil van Dijk","Frenkie de Jong"],
  ["Achraf Hakimi","Youssef En-Nesyri"],
];

function rateTeam(slots, formation) {
  const filled = slots.filter((s) => s.player);
  const players = filled.map((s) => ({ ...s.player, code: s.code }));
  if (!players.length) return null;
  const wt = { GK:1.0, DEF:1.05, MID:1.0, FWD:1.1 };
  let wSum=0, wTot=0;
  slots.forEach((s) => { if (s.player) { const grp = SLOT_GROUP(s.code); const fit = eligible(s.player, s.code) ? 1.0 : 0.8; wSum += s.player.ovr*wt[grp]*fit; wTot += wt[grp]; } });
  let strength = wTot ? wSum/wTot : 0;
  const links = {}; players.forEach((p) => { links[p.club2 || p.nationKey] = (links[p.club2 || p.nationKey]||0)+1; });
  let chem = 0; Object.values(links).forEach((n) => { if (n>=2) chem += (n-1)*0.9; });
  const names = new Set(players.map((p) => p.name));
  let legend = []; LEGENDARY_PAIRS.forEach(([a,b]) => { if (names.has(a)&&names.has(b)) legend.push([a,b]); });
  const legendBonus = legend.length * 1.4;
  const topOvr = Math.max(...players.map((p) => p.ovr));
  const star = topOvr>=90?1.6:topOvr>=88?1.0:topOvr>=86?0.5:0;
  const rating = strength + chem + legendBonus + star;
  const att = avgGroup(slots,["FWD"])*0.6 + avgGroup(slots,["MID"])*0.4 + star*2;
  const def = avgGroup(slots,["DEF"])*0.7 + avgGroup(slots,["GK"])*0.3;
  return { rating: Math.round(rating*10)/10, strength, chem: Math.round(chem*10)/10, legend, star, att, def, players };
}
function avgGroup(slots, groups) {
  const xs = slots.filter((s)=>s.player && groups.includes(SLOT_GROUP(s.code))).map((s)=>s.player.ovr);
  return xs.length ? xs.reduce((a,b)=>a+b,0)/xs.length : 78;
}

// ---- Live match sim: real national opponents, group then sudden-death knockouts ----
const OPP_POOL = [
  { name:"Norway", flag:"🇳🇴" },{ name:"Austria", flag:"🇦🇹" },{ name:"Turkey", flag:"🇹🇷" },
  { name:"Serbia", flag:"🇷🇸" },{ name:"Ghana", flag:"🇬🇭" },{ name:"Ivory Coast", flag:"🇨🇮" },
  { name:"Egypt", flag:"🇪🇬" },{ name:"Australia", flag:"🇦🇺" },{ name:"Canada", flag:"🇨🇦" },
  { name:"Peru", flag:"🇵🇪" },{ name:"Chile", flag:"🇨🇱" },{ name:"Sweden", flag:"🇸🇪" },
  { name:"Wales", flag:"🏴󠁧󠁢󠁷󠁬󠁳󠁿" },{ name:"Greece", flag:"🇬🇷" },{ name:"Scotland", flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
];
const OPP_GIANTS = [
  { name:"Brazil", flag:"🇧🇷" },{ name:"France", flag:"🇫🇷" },{ name:"Argentina", flag:"🇦🇷" },
  { name:"Spain", flag:"🇪🇸" },{ name:"Germany", flag:"🇩🇪" },{ name:"England", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name:"Portugal", flag:"🇵🇹" },{ name:"Netherlands", flag:"🇳🇱" },
];

function simulateMatch(team, roundIdx, seed) {
  const knockout = roundIdx >= 3;
  // knockout rounds are 3..7 (R32, R16, QF, SF, Final); opponent ramps to the final
  const oppRating = (knockout ? 80 + (roundIdx-3)*2.2 : 77 + roundIdx*1.3) + rnd(seed)*2.4;
  // giants appear from the quarter-finals (round 5) onward; mixed pool earlier in knockouts
  const pool = (roundIdx >= 5) ? OPP_GIANTS : (roundIdx >= 3 ? [...OPP_GIANTS, ...OPP_POOL] : OPP_POOL);
  const opp = pool[Math.floor(rnd(seed*3.1)*pool.length)];
  const myXG = clamp(0.7 + (team.att - oppRating)/14 + 0.6, 0.2, 4.2);
  const oppXG = clamp(0.7 + (oppRating - team.def)/14 + 0.2, 0.1, 3.6);
  const myGoals = poisson(myXG, seed*1.7), oppGoals = poisson(oppXG, seed*2.3);
  const scorers = team.players.map((p) => { const grp = SLOT_GROUP(p.code); const base = grp==="FWD"?3:grp==="MID"?1.3:grp==="GK"?0:0.22; return { p, w: base*(0.5 + p.g/Math.max(1,p.apps)) }; });
  const totW = scorers.reduce((a,b)=>a+b.w,0)||1;
  const assisters = team.players.map((p) => { const grp = SLOT_GROUP(p.code); const base = grp==="MID"?2.2:grp==="FWD"?1.4:grp==="GK"?0:0.7; return { p, w: base*(0.4 + p.a/Math.max(1,p.apps)) }; });
  const totA = assisters.reduce((a,b)=>a+b.w,0)||1;
  function pick(list,tot,s){ let r=rnd(s)*tot; for(const it of list){ r-=it.w; if(r<=0) return it.p; } return list[0].p; }
  const minutes=[];
  for(let i=0;i<myGoals;i++) minutes.push({team:"me",minute:1+Math.floor(rnd(seed*5+i)*90)});
  for(let i=0;i<oppGoals;i++) minutes.push({team:"opp",minute:1+Math.floor(rnd(seed*7+i*1.3)*90)});
  minutes.sort((a,b)=>a.minute-b.minute);
  const events=[];
  minutes.forEach((m,i)=>{
    if(m.team==="me"){ const sc=pick(scorers,totW,seed*11+i*2.7); let as=null; if(rnd(seed*29+i*1.9)<0.55){ const c=pick(assisters,totA,seed*31+i*3.3); if(c&&c.name!==sc.name) as=c; }
      events.push({minute:m.minute,type:"goal",team:"me",scorer:sc.name,flag:sc.flag,assist:as?as.name:null}); }
    else events.push({minute:m.minute,type:"goal",team:"opp",scorer:`${opp.flag} ${opp.name}`});
  });
  if(rnd(seed*13)<0.11){ const toMe=rnd(seed*17)<0.4; const minute=30+Math.floor(rnd(seed*19)*60); let who=`${opp.flag} ${opp.name}`;
    if(toMe){ const d=team.players.filter((p)=>SLOT_GROUP(p.code)!=="FWD"); who=d.length?d[Math.floor(rnd(seed*23)*d.length)].name:team.players[0].name; }
    events.push({minute,type:"red",team:toMe?"me":"opp",scorer:who}); }
  events.sort((a,b)=>a.minute-b.minute);
  let shootout=null;
  if(knockout && myGoals===oppGoals){ const edge=clamp(0.5+(team.att+team.def-2*oppRating)/40,0.2,0.8); shootout=rnd(seed*37)<edge?"W":"L"; }
  const base = myGoals>oppGoals?"W":myGoals<oppGoals?"L":"D";
  return { events, hg:myGoals, ag:oppGoals, opp, knockout, shootout, result: shootout||base, cleanSheet: oppGoals===0 };
}
function rnd(s){ const x=Math.sin(s*12.9898)*43758.5453; return x-Math.floor(x); }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function poisson(lambda,seed){ const L=Math.exp(-lambda); let k=0,p=1; do{ k++; p*=rnd(seed+k*0.37);}while(p>L&&k<9); return k-1; }

const STAGE_LABELS = ["Group Match 1","Group Match 2","Group Match 3","Round of 32","Round of 16","Quarter-Final","Semi-Final","Final"];
function runTournament(team) {
  const matches=[]; let w=0,d=0,l=0,eliminated=false,exitStage=null,groupPts=0;
  const stats={}; team.players.forEach((p)=>{ stats[p.name]={name:p.name,flag:p.flag,club:p.club,group:SLOT_GROUP(p.code),code:p.code,g:0,a:0,cs:0,apps:0}; });
  for(let i=0;i<8;i++){
    const m=simulateMatch(team,i,(i+1)*3.7+Math.random()*100000); m.stage=STAGE_LABELS[i]; matches.push(m);
    if(m.result==="W"){ w++; groupPts+=(i<3?3:0); } else if(m.result==="D"){ d++; groupPts+=(i<3?1:0); } else l++;
    team.players.forEach((p)=>stats[p.name].apps++);
    m.events.forEach((e)=>{ if(e.type==="goal"&&e.team==="me"){ if(stats[e.scorer])stats[e.scorer].g++; if(e.assist&&stats[e.assist])stats[e.assist].a++; } });
    if(m.cleanSheet) team.players.forEach((p)=>{ const g=SLOT_GROUP(p.code); if(g==="GK"||g==="DEF")stats[p.name].cs++; });
    if(i===2){ if(groupPts<4){ eliminated=true; exitStage="Group Stage"; break; } }
    else if(i>=3){ if(m.result==="L"){ eliminated=true; exitStage=m.stage; break; } }
  }
  const champions = !eliminated && matches.length===8 && matches[7].result==="W";
  return { matches, record:{wins:w,draws:d,losses:l}, groupPts, eliminated, exitStage, champions, stats:Object.values(stats), played:matches.length };
}
function tierFor(tour){
  const { record:r, champions, exitStage } = tour;
  if(champions && r.draws===0 && r.losses===0 && r.wins===8) return { name:"8-0 — IMMORTAL", color:"#d4af37", note:"Eight games, eight wins. The perfect World Cup." };
  if(champions) return { name:"World Champions", color:"#c9a227", note:"Lifted the trophy. Champions of the world." };
  if(exitStage==="Final") return { name:"Finalist", color:"#b07d2b", note:"Beaten in the final. So close to glory." };
  if(exitStage==="Semi-Final") return { name:"Semi-Finalist", color:"#7a8a3a", note:"Knocked out in the last four." };
  if(exitStage==="Quarter-Final") return { name:"Quarter-Finalist", color:"#4f7a8a", note:"Out in the last eight." };
  if(exitStage==="Round of 16") return { name:"Round of 16", color:"#5a6478", note:"Beaten in the second knockout round." };
  if(exitStage==="Round of 32") return { name:"Round of 32", color:"#6a6478", note:"Beaten in the first knockout round." };
  return { name:"Group Stage Exit", color:"#8a4a4a", note:"Failed to escape the group." };
}

// ===========================================================================
// UI
// ===========================================================================
// UI (mobile-first)
// ===========================================================================
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Franklin:ital,wght@0,400;0,600;0,800;1,400&family=Spectral:ital,wght@0,400;0,600;1,400&display=swap');`;
const C = { ink:"#16140f", paper:"#f4efe3", paper2:"#ece4d2", red:"#a8201a", gold:"#c9a227", green:"#1f3d2b", line:"#cdbfa0", faint:"#8a7f68" };

export default function App() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("classic");
  const [hard, setHard] = useState(false);
  const [formation, setFormation] = useState("4-3-3");
  const [slots, setSlots] = useState(() => formationSlots("4-3-3"));
  const [round, setRound] = useState(0);
  const [spin, setSpin] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [rerollUsed, setRerollUsed] = useState(false);
  const [usedNations, setUsedNations] = useState([]);
  const [tourney, setTourney] = useState(null);
  const [team, setTeam] = useState(null);

  const totalSlots = slots.length;
  function openSlots(s){ return s.filter((x)=>!x.player); }
  function nationHasEligible(squad, s){ const opens = openSlots(s); return squad.players.some((p)=> opens.some((o)=> eligible(p, o.code))); }

  function startGame() {
    const s = formationSlots(formation);
    setSlots(s); setRound(0); setUsedNations([]); setRerollUsed(false);
    setTourney(null); setTeam(null);
    setScreen("draft"); doSpin([], s);
  }
  function doSpin(used, currentSlots) {
    setSpinning(true); setSpin(null);
    const pool = SQUADS.filter((sq)=> !used.includes(sq.nation));
    let cands = pool.filter((sq)=> nationHasEligible(sq, currentSlots));
    if (!cands.length) cands = pool;
    const finalSquad = cands[Math.floor(Math.random()*cands.length)] || pool[0];
    let ticks = 0; const maxTicks = 14 + Math.floor(Math.random()*7);
    const iv = setInterval(() => {
      ticks++;
      setSpin(SQUADS[Math.floor(Math.random()*SQUADS.length)]);
      if (ticks >= maxTicks) { clearInterval(iv); setSpin(finalSquad); setSpinning(false); }
    }, 70);
  }
  function reroll() { if (rerollUsed || spinning) return; setRerollUsed(true); doSpin(usedNations, slots); }

  function draftPlayer(player, squad) {
    const opens = openSlots(slots).filter((o)=> eligible(player, o.code));
    if (!opens.length) return;
    let target = opens.find((o)=> (SLOT_ELIG[o.code]||[])[0] === player.roles[0]) || opens[0];
    const idx = slots.findIndex((s)=> s.code===target.code && !s.player);
    const next = slots.slice();
    next[idx] = { ...next[idx], player: { ...player, nationKey: squad.nation, flag: squad.flag, conf: squad.conf } };
    setSlots(next);
    const used = [...usedNations, squad.nation];
    setUsedNations(used);
    const nr = round + 1; setRound(nr);
    if (nr >= totalSlots) { const tm = rateTeam(next, formation); const tour = runTournament(tm); setTeam(tm); setTourney(tour); setScreen("watch"); }
    else doSpin(used, next);
  }
  function eligibleSlotsFor(player){ return openSlots(slots).filter((o)=> eligible(player, o.code)); }

  const wrap = { minHeight:"100vh", background:C.paper, color:C.ink, fontFamily:"'Libre Franklin', sans-serif",
    backgroundImage:"radial-gradient(circle at 20% 10%, rgba(168,32,26,0.04), transparent 40%), radial-gradient(circle at 85% 80%, rgba(201,162,39,0.05), transparent 45%)" };
  const maxw = { width:"100%", maxWidth: 720, margin:"0 auto", padding:"0 14px" };
  const display = { fontFamily:"'Bebas Neue', sans-serif", letterSpacing:"0.02em", lineHeight:0.92 };

  return (
    <div style={wrap}>
      <style>{FONTS}</style>
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        html, body { margin:0; padding:0; overflow-x:hidden; }
        @keyframes pop { 0%{transform:scale(.7);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
        @keyframes slideUp { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes reelFlash { 0%,100%{background:${C.paper2}} 50%{background:#fff} }
        @keyframes evIn { from{transform:translateX(-8px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .pcard{transition:transform .1s, box-shadow .1s; cursor:pointer; touch-action:manipulation;}
        .pcard:active{transform:scale(.97)}
        .pcard.disabled{opacity:.42}
        .btn{transition:transform .1s; cursor:pointer; touch-action:manipulation; user-select:none;}
        .btn:active{transform:scale(.97)}
        input, button { font-family:'Libre Franklin', sans-serif; }
      `}</style>

      <header style={{ borderBottom:`3px double ${C.ink}`, background:C.paper, position:"sticky", top:0, zIndex:30 }}>
        <div style={{ ...maxw, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:9, cursor:"pointer", minWidth:0 }} onClick={()=>setScreen("home")}>
            <span style={{ ...display, fontSize:34, color:C.red }}>8&ndash;0</span>
            <span style={{ fontFamily:"'Spectral', serif", fontStyle:"italic", fontSize:12, color:C.faint, borderLeft:`1px solid ${C.line}`, paddingLeft:9, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>World Cup 2026</span>
          </div>
        </div>
      </header>

      {screen==="home" && <Home {...{maxw,display,mode,setMode,hard,setHard,formation,setFormation,startGame}} />}
      {screen==="draft" && <Draft {...{maxw,display,slots,round,totalSlots,spin,spinning,mode,hard,reroll,rerollUsed,draftPlayer,formation,eligibleSlotsFor}} />}
      {screen==="watch" && tourney && team && <Watch {...{maxw,display,tourney,team,slots,formation,mode,hard,startGame,setScreen}} />}

      <footer style={{ ...maxw, padding:"26px 14px 44px", color:C.faint, fontSize:11, textAlign:"center", fontFamily:"'Spectral', serif", fontStyle:"italic" }}>
        Inspired by 38-0 and 82-0. World Cup 2026 squads, 2024-25 club form.
      </footer>
    </div>
  );
}

function Pill({ children, active, onClick, big }) {
  return (<span className="btn" onClick={onClick} style={{ padding: big?"12px 16px":"9px 14px", borderRadius:3, fontSize: big?15:13, fontWeight:700,
    border:`1.5px solid ${active?C.ink:C.line}`, background: active?C.ink:C.paper, color: active?C.paper:C.ink, textTransform:"uppercase", letterSpacing:"0.06em", display:"inline-block", textAlign:"center" }}>{children}</span>);
}
function Section({ label, children }) {
  return (<section style={{ marginBottom:24 }}><div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.2em", color:C.red, fontWeight:700, marginBottom:11 }}>{label}</div>{children}</section>);
}

// Responsive pitch: tokens sized with clamp() so labels never collide on phones.
function Pitch({ slots, formation, highlightOpen }) {
  const layout = LAYOUT[formation];
  return (
    <div style={{ position:"relative", width:"100%", aspectRatio:"3/4", maxWidth:380, margin:"0 auto",
      background:"linear-gradient(180deg,#205232,#163b24)", borderRadius:10, overflow:"hidden",
      backgroundImage:"linear-gradient(180deg,#205232,#163b24), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 7%, transparent 7% 14%)", border:`2px solid #14361f` }}>
      <div style={{ position:"absolute", left:0, right:0, top:"50%", height:1, background:"rgba(255,255,255,0.22)" }} />
      <div style={{ position:"absolute", left:"50%", top:"50%", width:"30%", aspectRatio:"1", border:"1px solid rgba(255,255,255,0.22)", borderRadius:"50%", transform:"translate(-50%,-50%)" }} />
      {slots.map((s, i)=> {
        const [x,y] = layout[s.code] || [50,50];
        const open = !s.player;
        return (
          <div key={i} style={{ position:"absolute", left:x+"%", top:y+"%", transform:"translate(-50%,-50%)", textAlign:"center", width:"22%" }}>
            <div style={{ width:"clamp(30px,9vw,40px)", height:"clamp(30px,9vw,40px)", borderRadius:"50%", margin:"0 auto",
              background: open ? "rgba(255,255,255,0.13)" : "#2e8b57",
              border:`2px solid ${highlightOpen && open ? C.gold : "#eafff2"}`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:"clamp(12px,3.4vw,15px)", color:"#fff", fontWeight:700,
              animation: highlightOpen && open ? "pulse 1.4s infinite" : "none", boxShadow:"0 2px 6px rgba(0,0,0,0.3)" }}>
              {s.player ? s.player.flag : POS_TAG[s.code]}
            </div>
            {s.player
              ? <div style={{ fontSize:"clamp(8px,2.4vw,10px)", color:"#fff", fontWeight:600, marginTop:2, textShadow:"0 1px 2px rgba(0,0,0,0.7)", lineHeight:1.05, whiteSpace:"nowrap" }}>{s.player.name.split(" ").slice(-1)}</div>
              : <div style={{ fontSize:"clamp(7px,2vw,9px)", color:"rgba(255,255,255,0.7)", marginTop:2, textTransform:"uppercase", letterSpacing:"0.02em", lineHeight:1 }}>{POS_TAG[s.code]}</div>}
          </div>
        );
      })}
    </div>
  );
}

function Home({ maxw, display, mode, setMode, hard, setHard, formation, setFormation, startGame }) {
  return (
    <main style={{ ...maxw, paddingTop:26, paddingBottom:20, animation:"slideUp .4s ease" }}>
      <div style={{ textAlign:"center", marginBottom:6 }}>
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.28em", color:C.faint, marginBottom:10 }}>World Cup 2026 · Spin · Draft · Watch</div>
        <h1 style={{ ...display, fontSize:"clamp(40px,11vw,64px)", margin:"0 0 8px" }}>BUILD THE XI THAT GOES <span style={{ color:C.red }}>EIGHT&ndash;NIL</span></h1>
        <p style={{ fontFamily:"'Spectral', serif", fontSize:15, color:"#4a443a", maxWidth:440, margin:"0 auto", lineHeight:1.5 }}>
          Spin a nation from this summer's World Cup. Pick one player from their XI, and the rest of that squad is gone. Fill your formation, then watch all eight matches play out.
        </p>
      </div>
      <div style={{ height:1, background:C.line, margin:"22px 0" }} />

      <Section label="01 — Choose your shape">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(82px, 1fr))", gap:8, marginBottom:14 }}>
          {Object.keys(FORMATIONS).map((f)=> <Pill key={f} active={formation===f} onClick={()=>setFormation(f)} big>{f}</Pill>)}
        </div>
        <p style={{ fontFamily:"'Spectral', serif", fontStyle:"italic", fontSize:14, color:C.faint, margin:"0 0 12px", textAlign:"center" }}>{FORMATION_INFO[formation]}</p>
        <Pitch slots={formationSlots(formation)} formation={formation} />
      </Section>

      <Section label="02 — Choose your mode">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
          <Pill active={mode==="classic"} onClick={()=>setMode("classic")} big>Classic</Pill>
          <Pill active={mode==="expert"} onClick={()=>setMode("expert")} big>Expert · Hidden</Pill>
        </div>
        <Pill active={hard} onClick={()=>setHard(!hard)} big>{hard?"Hard Mode: No Reroll ✓":"Hard Mode (no reroll)"}</Pill>
        <p style={{ fontFamily:"'Spectral', serif", fontStyle:"italic", fontSize:13, color:C.faint, marginTop:10 }}>
          {mode==="classic" ? "Ratings and club stats on show." : "Stats hidden. Names and positions only."}{hard?" No rerolls.":""}
        </p>
      </Section>

      <button className="btn" onClick={startGame} style={{ marginTop:18, width:"100%", padding:"18px", background:C.red, color:C.paper, border:"none", borderRadius:4, fontFamily:"'Bebas Neue', sans-serif", fontSize:28, letterSpacing:"0.06em", boxShadow:"0 5px 0 #6e120e" }}>SPIN THE WHEEL →</button>
    </main>
  );
}

function Draft({ maxw, display, slots, round, totalSlots, spin, spinning, mode, hard, reroll, rerollUsed, draftPlayer, formation, eligibleSlotsFor }) {
  const progress = Math.round((round/totalSlots)*100);
  const showStats = mode==="classic";
  return (
    <main style={{ ...maxw, paddingTop:16, paddingBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.14em", color:C.faint, fontWeight:600 }}>Pick {round+1} of {totalSlots} · {formation}</span>
        <span style={{ fontSize:11, color:C.faint }}>{round} in</span>
      </div>
      <div style={{ height:5, background:C.paper2, borderRadius:3, marginBottom:16 }}><div style={{ height:"100%", width:progress+"%", background:C.red, borderRadius:3, transition:"width .3s" }} /></div>

      <div style={{ textAlign:"center", marginBottom:6 }}>
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:C.faint, marginBottom:8 }}>{spinning?"Spinning…":"Pick one · the rest of this squad is gone"}</div>
        <div style={{ background:C.ink, borderRadius:8, padding:"16px", color:C.paper, animation: spinning?"reelFlash .15s infinite":"none", boxShadow:"inset 0 0 0 3px rgba(201,162,39,0.4)" }}>
          <div style={{ fontSize:42 }}>{spin?spin.flag:"🎰"}</div>
          <div style={{ ...display, fontSize:"clamp(28px,8vw,38px)", color: spinning?C.gold:C.paper }}>{spin?spin.nation:"— — —"}</div>
          <div style={{ fontSize:12, color:C.gold, letterSpacing:"0.16em", fontWeight:600 }}>{spin?`WORLD CUP 2026 · ${spin.conf}`:""}</div>
        </div>
        {!hard && (
          <button className="btn" onClick={reroll} disabled={rerollUsed||spinning} style={{ marginTop:10, padding:"10px 18px", background:C.paper, border:`1.5px solid ${rerollUsed?C.line:C.ink}`, borderRadius:4, color: rerollUsed?C.faint:C.ink, fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", opacity: rerollUsed?0.5:1 }}>{rerollUsed?"Reroll used":"↻ Reroll (once)"}</button>
        )}
      </div>

      {spin && !spinning && (
        <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {spin.players.map((p, i)=> {
            const fit = eligibleSlotsFor(p);
            const can = fit.length>0;
            return (
              <div key={i} className={"pcard"+(can?"":" disabled")} onClick={()=> can && draftPlayer(p, spin)} style={{ background:C.paper2, border:`1px solid ${C.line}`, borderRadius:6, padding:"11px 12px", animation:`pop .28s ease ${i*0.025}s both`, borderLeft:`4px solid ${can?C.green:C.faint}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:6 }}>
                  <span style={{ fontSize:10, fontWeight:700, color: can?C.green:C.faint, textTransform:"uppercase", letterSpacing:"0.04em" }}>{p.roles.join("/")}</span>
                  {showStats && <span style={{ ...display, fontSize:22, color:C.red, lineHeight:1 }}>{p.ovr}</span>}
                </div>
                <div style={{ fontFamily:"'Spectral', serif", fontWeight:600, fontSize:15, margin:"3px 0 3px", lineHeight:1.12 }}>{p.name}</div>
                <div style={{ fontSize:10, color:C.faint }}>{p.club}</div>
                {showStats && <div style={{ fontSize:11, color:C.ink, marginTop:3 }}>{p.g}G · {p.a}A</div>}
                <div style={{ fontSize:9, color: can?C.faint:"#a8201a", marginTop:5, fontStyle:"italic", lineHeight:1.2 }}>{can ? `→ ${fit.map((s)=>SLOT_NAME[s.code]).slice(0,2).join(", ")}` : "No open slot"}</div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop:22 }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.18em", color:C.red, fontWeight:700, marginBottom:9 }}>Your XI · {formation}</div>
        <Pitch slots={slots} formation={formation} highlightOpen />
      </div>
    </main>
  );
}

function Watch({ maxw, display, tourney, team, slots, formation, mode, hard, startGame, setScreen }) {
  const [stage, setStage] = useState(0);
  const [clock, setClock] = useState(0);
  const [shown, setShown] = useState([]);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(true);
  const matches = tourney.matches;
  const rec = tourney.record;
  const tier = tierFor(tourney);

  useEffect(()=> {
    if (!running) return;
    if (stage >= matches.length) { setDone(true); return; }
    const m = matches[stage];
    const matchMs = 4000; const tick = 30; let elapsed = 0;
    const iv = setInterval(()=> {
      elapsed += tick;
      const minute = Math.min(90, Math.round((elapsed/matchMs)*90));
      setClock(minute);
      setShown(m.events.filter((e)=> e.minute<=minute));
      if (elapsed >= matchMs) {
        clearInterval(iv);
        setTimeout(()=> { if (stage+1 >= matches.length) setDone(true); else { setStage(stage+1); setClock(0); setShown([]); } }, 800);
      }
    }, tick);
    return ()=> clearInterval(iv);
  }, [stage, running]);

  function skipAll(){ setRunning(false); setDone(true); }

  const m = matches[Math.min(stage, matches.length-1)];
  const myG = m.events.filter((e)=> e.minute<=clock && e.team==="me" && e.type==="goal").length;
  const opG = m.events.filter((e)=> e.minute<=clock && e.team==="opp" && e.type==="goal").length;
  const finished = clock>=90;

  if (done) return <Result {...{maxw,display,tourney,team,slots,formation,mode,hard,rec,tier,startGame,setScreen}} />;

  return (
    <main style={{ ...maxw, paddingTop:16, paddingBottom:20, animation:"slideUp .4s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.14em", color:C.faint, fontWeight:600 }}>{m.stage}{m.knockout?" · sudden death":""}</span>
        <span className="btn" onClick={skipAll} style={{ fontSize:11, color:C.red, textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:700 }}>Skip →</span>
      </div>

      <div style={{ background:C.ink, borderRadius:10, padding:"18px 14px", color:C.paper, textAlign:"center" }}>
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.2em", color:C.gold, marginBottom:10 }}>Match {stage+1}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:10 }}>
          <div style={{ ...display, fontSize:"clamp(15px,4.6vw,20px)", textAlign:"right" }}>Your XI</div>
          <div style={{ ...display, fontSize:"clamp(44px,14vw,60px)" }}>{myG}<span style={{ color:C.faint }}>&ndash;</span>{opG}</div>
          <div style={{ ...display, fontSize:"clamp(15px,4.6vw,20px)", color:C.faint, textAlign:"left" }}>{m.opp.flag} {m.opp.name}</div>
        </div>
        <div style={{ marginTop:8, fontSize:13, color:C.gold, fontWeight:600 }}>{clock}'</div>
        <div style={{ height:3, background:"rgba(255,255,255,0.15)", borderRadius:2, marginTop:7, maxWidth:280, marginInline:"auto" }}>
          <div style={{ height:"100%", width:(clock/90*100)+"%", background:C.gold, borderRadius:2 }} />
        </div>
        {finished && m.shootout && <div style={{ marginTop:10, fontSize:13, fontWeight:700, letterSpacing:"0.06em", color: m.shootout==="W"?"#7fd49a":"#e08585" }}>{m.shootout==="W"?"WON ON PENALTIES":"LOST ON PENALTIES"}</div>}
      </div>

      <div style={{ marginTop:14, minHeight:110 }}>
        {shown.length===0 ? (
          <p style={{ fontFamily:"'Spectral', serif", fontStyle:"italic", color:C.faint, textAlign:"center" }}>Kick-off…</p>
        ) : shown.map((e, i)=> (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 6px", borderBottom:`1px solid ${C.line}`, animation:"evIn .3s ease" }}>
            <span style={{ ...display, fontSize:18, width:38, color:C.red }}>{e.minute}'</span>
            {e.type==="goal" ? (
              <>
                <span style={{ fontSize:15 }}>⚽</span>
                <span style={{ fontFamily:"'Spectral', serif", fontWeight:600, fontSize:14, minWidth:0 }}>
                  {e.team==="me" ? `${e.flag||""} ${e.scorer}` : e.scorer}
                  {e.team==="me" && e.assist && <span style={{ fontWeight:400, fontStyle:"italic", color:C.faint }}> ({e.assist})</span>}
                </span>
                <span style={{ fontSize:10, color:C.faint, marginLeft:"auto", textTransform:"uppercase" }}>{e.team==="me"?"Goal":"Conceded"}</span>
              </>
            ) : (
              <>
                <span style={{ fontSize:15 }}>🟥</span>
                <span style={{ fontFamily:"'Spectral', serif", fontWeight:600, fontSize:14 }}>{e.scorer}</span>
                <span style={{ fontSize:10, color:C.faint, marginLeft:"auto", textTransform:"uppercase" }}>{e.team==="me"?"Off":"Opp off"}</span>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop:14, display:"flex", gap:5, justifyContent:"center" }}>
        {matches.map((mm, i)=> (
          <div key={i} style={{ flex:1, maxWidth:34, height:6, borderRadius:3, background: i<stage?(mm.result==="W"?C.green:(mm.result==="L"?C.red:C.faint)) : i===stage?C.gold : C.paper2 }} />
        ))}
      </div>
    </main>
  );
}

function Result({ maxw, display, tourney, team, slots, formation, mode, hard, rec, tier, startGame, setScreen }) {
  const [shareMsg, setShareMsg] = useState("");
  const stats = [...tourney.stats];
  const scorers = [...stats].filter((s)=>s.g>0).sort((a,b)=> b.g-a.g || b.a-a.a);
  const playmakers = [...stats].filter((s)=>s.a>0).sort((a,b)=> b.a-a.a || b.g-a.g);
  const keepers = [...stats].filter((s)=>s.group==="GK").sort((a,b)=> b.cs-a.cs);
  const motm = [...stats].sort((a,b)=> (b.g*3+b.a*2)-(a.g*3+a.a*2))[0];
  const boot = scorers[0], playmaker = playmakers[0], glove = keepers[0];
  const order = { FWD:0, MID:1, DEF:2, GK:3 };
  const table = [...stats].sort((a,b)=> order[a.group]-order[b.group] || b.g-a.g || b.a-a.a);
  const GROUP_COL = { GK:C.gold, DEF:"#4f7a8a", MID:C.green, FWD:C.red };
  const posTag = (code)=> POS_TAG[code] || code;

  // ----- Share -----
  const SITE_URL = "https://seven-nil.manualmode.xyz/";
  const recStr = `${rec.wins}-${rec.draws}-${rec.losses}`;
  const xiLines = slots.map((s)=> `${posTag(s.code)}: ${s.player.flag} ${s.player.name}`).join("\n");
  const shareText =
`⚽ 8-0 · World Cup 2026
My dream XI finished: ${tier.name}
Record ${recStr} · ${formation} · Strength ${team.rating}
${boot ? `Top scorer: ${boot.name} (${boot.g})\n` : ""}
My XI:
${xiLines}

Think you can beat my ${recStr}? Build yours 👉 ${SITE_URL}`;

  async function shareTextNow() {
    // prefer the live URL if present, else the known site URL
    const liveUrl = (typeof window!=="undefined" && window.location && window.location.href) ? window.location.href : SITE_URL;
    const full = shareText.includes(SITE_URL) ? shareText : shareText + "\n" + liveUrl;
    try {
      if (navigator.share) { await navigator.share({ title:"8-0 · World Cup 2026", text: full, url: liveUrl }); return; }
    } catch(e){ /* user cancelled or unsupported */ }
    try { await navigator.clipboard.writeText(full); setShareMsg("Copied to clipboard, paste it into WhatsApp."); }
    catch(e){ setShareMsg("Press and hold the text below to copy it."); }
  }

  function buildCardCanvas() {
    const scale = 2;
    const W = 540, H = 960;
    const cv = document.createElement("canvas");
    cv.width = W*scale; cv.height = H*scale;
    const ctx = cv.getContext("2d"); ctx.scale(scale, scale);
    // bg
    ctx.fillStyle = C.paper; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = C.ink; ctx.fillRect(0,0,W,8);
    ctx.fillRect(0,H-8,W,8);
    // header
    ctx.fillStyle = C.red; ctx.font = "700 64px Georgia, serif"; ctx.textAlign="left";
    ctx.fillText("8–0", 36, 86);
    ctx.fillStyle = C.faint; ctx.font = "italic 18px Georgia, serif";
    ctx.fillText("World Cup 2026 · Dream XI", 150, 80);
    ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(36,108); ctx.lineTo(W-36,108); ctx.stroke();
    // result
    ctx.fillStyle = C.faint; ctx.font = "600 14px Georgia"; ctx.fillText("FINAL STANDING", 36, 150);
    ctx.fillStyle = C.red; ctx.font = "700 84px Georgia"; ctx.fillText(recStr, 36, 232);
    ctx.fillStyle = C.ink; ctx.font = "700 36px Georgia"; ctx.fillText(tier.name.replace(" — IMMORTAL",""), 36, 280);
    ctx.fillStyle = C.faint; ctx.font = "16px Georgia";
    ctx.fillText(`${formation}  ·  Strength ${team.rating}` + (boot?`  ·  Top: ${boot.name} (${boot.g})`:""), 36, 312);
    // XI
    ctx.fillStyle = C.red; ctx.font = "700 14px Georgia"; ctx.fillText("THE XI", 36, 360);
    ctx.fillStyle = C.ink; ctx.font = "18px Georgia";
    slots.forEach((s, i)=> {
      const y = 392 + i*42;
      ctx.fillStyle = C.green; ctx.font = "700 13px Georgia"; ctx.fillText(posTag(s.code).padEnd(4," "), 36, y);
      ctx.fillStyle = C.ink; ctx.font = "18px Georgia";
      ctx.fillText(`${s.player.name}`, 96, y);
      ctx.fillStyle = C.faint; ctx.font = "13px Georgia";
      ctx.fillText(s.player.club, 96, y+16);
    });
    // challenge footer
    ctx.fillStyle = C.ink; ctx.fillRect(0,H-96,W,88);
    ctx.fillStyle = C.gold; ctx.font = "700 20px Georgia"; ctx.textAlign="center";
    ctx.fillText(`Can you beat ${recStr}?`, W/2, H-58);
    ctx.fillStyle = C.paper; ctx.font = "700 16px Georgia";
    ctx.fillText("seven-nil.manualmode.xyz", W/2, H-32);
    ctx.fillStyle = C.faint; ctx.font = "italic 12px Georgia";
    ctx.fillText("Build your World Cup 2026 XI", W/2, H-14);
    return cv;
  }

  async function shareImageNow() {
    setShareMsg("");
    try {
      const cv = buildCardCanvas();
      cv.toBlob(async (blob)=> {
        if (!blob) { setShareMsg("Could not build image on this device."); return; }
        const file = new File([blob], "seven-nil-2026.png", { type:"image/png" });
        try {
          if (navigator.canShare && navigator.canShare({ files:[file] }) && navigator.share) {
            await navigator.share({ files:[file], title:"8-0 · World Cup 2026", text:`My dream XI finished ${tier.name} (${recStr}). Beat it?` });
            return;
          }
        } catch(e){ /* fall through to download */ }
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "seven-nil-2026.png"; a.click();
        setShareMsg("Image saved, share it from your photos.");
      }, "image/png");
    } catch(e){ setShareMsg("Image sharing isn't supported here, use Share text instead."); }
  }

  function Award({ icon, label, who, detail }) {
    return (
      <div style={{ border:`1px solid ${C.line}`, borderRadius:6, padding:"10px 12px", background:C.paper2 }}>
        <div style={{ fontSize:9, textTransform:"uppercase", letterSpacing:"0.1em", color:C.faint, fontWeight:700 }}>{icon} {label}</div>
        <div style={{ fontFamily:"'Spectral', serif", fontWeight:600, fontSize:15, marginTop:3, lineHeight:1.1 }}>{who ? `${who.flag||""} ${who.name}` : "—"}</div>
        {who && <div style={{ fontSize:11, color:C.faint }}>{detail}</div>}
      </div>
    );
  }

  return (
    <main style={{ ...maxw, paddingTop:18, paddingBottom:20, animation:"slideUp .4s ease" }}>
      <div style={{ textAlign:"center", border:`3px double ${C.ink}`, padding:"20px 14px", background:C.paper2 }}>
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.26em", color:C.faint }}>Final Standing</div>
        <div style={{ ...display, fontSize:"clamp(58px,18vw,84px)", color:C.red, margin:"2px 0" }}>{rec.wins}&ndash;{rec.draws}&ndash;{rec.losses}</div>
        <div style={{ ...display, fontSize:"clamp(28px,8vw,38px)", color:tier.color }}>{tier.name}</div>
        <p style={{ fontFamily:"'Spectral', serif", fontStyle:"italic", fontSize:15, color:"#4a443a", maxWidth:420, margin:"6px auto 0" }}>{tier.note}</p>
        <div style={{ marginTop:12, display:"flex", justifyContent:"center", gap:16, fontSize:11, color:C.faint, textTransform:"uppercase", letterSpacing:"0.08em", flexWrap:"wrap" }}>
          <span>Strength <b style={{ color:C.ink }}>{team.rating}</b></span>
          <span>Chem <b style={{ color:C.ink }}>+{team.chem}</b></span>
          <span>{formation}</span>
        </div>
      </div>

      {/* SHARE — top of result so it's the obvious next action */}
      <div style={{ marginTop:16, padding:14, border:`2px solid ${C.green}`, borderRadius:8, background:"rgba(31,61,43,0.06)" }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.14em", color:C.green, fontWeight:700, marginBottom:8, textAlign:"center" }}>Challenge your friends</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <button className="btn" onClick={shareTextNow} style={{ padding:"14px", background:C.green, color:C.paper, border:"none", borderRadius:5, fontWeight:700, fontSize:14, textTransform:"uppercase", letterSpacing:"0.06em" }}>Share text</button>
          <button className="btn" onClick={shareImageNow} style={{ padding:"14px", background:C.paper, color:C.green, border:`2px solid ${C.green}`, borderRadius:5, fontWeight:700, fontSize:14, textTransform:"uppercase", letterSpacing:"0.06em" }}>Share image</button>
        </div>
        {shareMsg && <p style={{ fontSize:12, color:C.faint, marginTop:8, textAlign:"center", fontStyle:"italic" }}>{shareMsg}</p>}
        <textarea readOnly value={shareText} onFocus={(e)=>e.target.select()} style={{ marginTop:10, width:"100%", height:96, fontSize:12, padding:"8px 10px", border:`1px solid ${C.line}`, borderRadius:5, background:C.paper, color:C.ink, resize:"vertical", fontFamily:"'Libre Franklin',sans-serif" }} />
      </div>

      {team.legend.length>0 && (
        <div style={{ marginTop:14, background:"rgba(201,162,39,0.12)", border:`1px solid ${C.gold}`, borderRadius:6, padding:"10px 12px" }}>
          <span style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.12em", color:"#8a6d12", fontWeight:700 }}>Star pairings · </span>
          <span style={{ fontFamily:"'Spectral', serif", fontStyle:"italic", fontSize:13 }}>{team.legend.map((p)=>p.join(" & ")).join(" · ")}</span>
        </div>
      )}

      <div style={{ marginTop:20 }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.16em", color:C.red, fontWeight:700, marginBottom:10 }}>The Run</div>
        <div style={{ border:`1px solid ${C.line}`, borderRadius:6, overflow:"hidden" }}>
          {tourney.matches.map((m, i)=> {
            const col = m.result==="W"?C.green:m.result==="L"?C.red:C.faint;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", background: i%2?"transparent":C.paper2, borderBottom: i<tourney.matches.length-1?`1px solid ${C.line}`:"none" }}>
                <span style={{ width:96, fontSize:10, color:C.faint, textTransform:"uppercase", letterSpacing:"0.04em" }}>{m.stage}</span>
                <span style={{ flex:1, fontFamily:"'Spectral', serif", fontSize:13, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.opp.flag} {m.opp.name}</span>
                <span style={{ ...display, fontSize:20 }}>{m.hg}&ndash;{m.ag}</span>
                {m.shootout && <span style={{ fontSize:9, color:C.faint }}>p</span>}
                <span style={{ width:20, height:20, borderRadius:"50%", background:col, color:C.paper, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{m.result}</span>
              </div>
            );
          })}
        </div>
        {tourney.eliminated && <p style={{ fontFamily:"'Spectral', serif", fontStyle:"italic", fontSize:13, color:C.red, marginTop:8 }}>Eliminated at the {tourney.exitStage}.</p>}
      </div>

      <div style={{ marginTop:20 }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.16em", color:C.red, fontWeight:700, marginBottom:10 }}>Tournament Awards</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          <Award icon="⚽" label="Golden Boot" who={boot} detail={boot && `${boot.g} goal${boot.g!==1?"s":""}`} />
          <Award icon="🎯" label="Playmaker" who={playmaker} detail={playmaker && `${playmaker.a} assist${playmaker.a!==1?"s":""}`} />
          <Award icon="🧤" label="Golden Glove" who={glove} detail={glove && `${glove.cs} clean sheet${glove.cs!==1?"s":""}`} />
          <Award icon="🏆" label="Player of the Tournament" who={motm} detail={motm && `${motm.g}G · ${motm.a}A`} />
        </div>
      </div>

      <div style={{ marginTop:20 }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.16em", color:C.red, fontWeight:700, marginBottom:10 }}>Player Performances</div>
        <div style={{ border:`1px solid ${C.line}`, borderRadius:6, overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:C.ink, color:C.paper, fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em" }}>
            <span style={{ width:30 }}>Pos</span>
            <span style={{ flex:1 }}>Player</span>
            <span style={{ width:26, textAlign:"right" }}>G</span>
            <span style={{ width:26, textAlign:"right" }}>A</span>
            <span style={{ width:26, textAlign:"right" }}>CS</span>
          </div>
          {table.map((s, i)=> (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", background: i%2?"transparent":C.paper2, borderBottom: i<table.length-1?`1px solid ${C.line}`:"none" }}>
              <span style={{ width:30 }}><span style={{ fontSize:9, fontWeight:700, color:C.paper, background:GROUP_COL[s.group], padding:"2px 5px", borderRadius:3 }}>{posTag(s.code)}</span></span>
              <span style={{ flex:1, fontFamily:"'Spectral', serif", fontWeight:600, fontSize:13, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.flag} {s.name}</span>
              <span style={{ width:26, textAlign:"right", fontWeight:700, color: s.g>0?C.red:C.faint }}>{s.g||"·"}</span>
              <span style={{ width:26, textAlign:"right", fontWeight:700, color: s.a>0?C.green:C.faint }}>{s.a||"·"}</span>
              <span style={{ width:26, textAlign:"right", color: s.cs>0?C.ink:C.faint }}>{(s.group==="GK"||s.group==="DEF")?(s.cs||"·"):"—"}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="btn" onClick={startGame} style={{ marginTop:20, width:"100%", padding:"18px", background:C.red, color:C.paper, border:"none", borderRadius:4, fontFamily:"'Bebas Neue', sans-serif", fontSize:26, letterSpacing:"0.05em", boxShadow:"0 5px 0 #6e120e" }}>PLAY AGAIN</button>
    </main>
  );
}
