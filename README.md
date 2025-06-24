# ENG (PL VERSION BELOW)
# BD2 - Team 1

Team members:
- Brygida Silawko
- Tomasz Smoleń
- Kornelia Błaszczuk
- Kinga Łukiewicz
- Aleksandra Raczyńska

## ER and Relational Model

Available in the files `baza.dmd` and in the `baza` folder.

Below is the ER model:

![model_ER](image.png)

## Functionalities

All functionalities are visible in the application prototype.

Project link: https://www.figma.com/proto/D5HsHUm82rfYiGNXeeGz8o/BD2---Serwis?node-id=0-1&t=Cvj9zYLqq3lRClIF-1

Main functionalities:
- display of the workshop's pricing and address information,
- user accounts,
- ability to add cars and schedule appointments,
- view visit history,
- access to visit reports in PDF format,
- for workshop admin: filling out repair reports and setting workshop parameters.

Our design assumption is a database dedicated to a specific workshop.

## Functional Elements at the Database Level

A trigger has been created for the `metadane` table – it ensures that there is at most one row of data.

The trigger code is located in the file `triiger_metadata.sql`.

## Analytical and Statistical Part

Charts have been developed for the admin (to facilitate workshop performance analysis) and for individual cars (to track mileage history).

### Charts for the Administrator
- Chart of repairs and services over a selected time period,
- Chart of workshop earnings over a selected time period.

### Chart for a Car
- Mileage history chart for a given vehicle.

## Technology Stack

1. Database
 - PostgreSQL 17 (cloud version),
 - does not require additional installations or configuration.

2. Application
 - Spring Boot + Node.js,
 - installation: JDK, Gradle, Node.js,
 - environment configuration: `.env` file with database connection parameters.

## Test Scenarios and Data

Most test data was entered during testing of individual application components.

## Project Launch Instructions

Recommended IDE: IntelliJ IDEA.

1. In the `frontend` folder, install the `yarn` library and run:
```bash
yarn dev
```

2. In the `wsapi` folder, place `.env` file and configure the Spring Boot application - WsapiApplication.
In the `build and run` section, set the following options:
- Java 22
- Main class: wsapi.main
- Package: com.workshop.wspai.WsapiApplication
<br>
Also add `enviroment variables` and specify the path to the `.env` file.

## Potential Issues
### 1. Port 8080 already in use  
Terminate the process using port 8080:
- Using Task Manager (Windows):<br>
In the `Details` tab, find the `httpd.exe` process. Right-click and select `End Task`.
- Using terminal (Windows):<br>
To identify the process:

```bash
netstat -aon | findstr :8080
```

Sample output:

```bash
TCP    0.0.0.0:8080     0.0.0.0:0     LISTENING     12345
```

To terminate it:

```bash
taskkill /PID 12345 /F
```

- Using terminal (Linux / macOS):<br>
Check for the process:

```bash
lsof -i :8080
```

Terminate the process (e.g., PID 12345):

```bash
kill -9 12345
```

### 2. IntelliJ does not find WsapiApplication
Go to `File` -> `Invalidate Caches`, then click `Invalidate and Restart` in the popup window.


# PL
# BD2 - zespół 1

Skład zespołu:
- Brygida Silawko
- Tomasz Smoleń
- Kornelia Błaszczuk
- Kinga Łukiewicz
- Aleksandra Raczyńska

## Model ER i relacyjny

Dostępne są w plikach baza.dmd oraz katalogu baza.

Poniżej model ER:

![model_ER](image.png)

## Funkcjonalności

Wszystkie funkcjonalności są widoczne w projekcie apikacji.

Link do projektu: https://www.figma.com/proto/D5HsHUm82rfYiGNXeeGz8o/BD2---Serwis?node-id=0-1&t=Cvj9zYLqq3lRClIF-1

Główne funkcjonalności:
- udostepnienie cennika warsztatu oraz jego danych adresowych,
- konta użytkowników,
- możliwość dodawania swoich aut i umawiania dla nich wizyt,
- wgląd w historię wizyt,
- dostęp do raportu z wizyty w formacie pdf,
- dla administratora warsztatu: wypełnianie raportów z napraw oraz ustawianie prametrów warsztatu.

Naszym założeniem projektowym jest baza danych dedykowana dla konkretnego warsztatu.

## Elementów funkcjonalnych na poziomie bazy danych

Został opracowany trigger dotyczący tabeli metadane - zapewnia on maksymalnie jeden wiersz danych.

Kod triggera znajduje się w pliku triiger_metadata.sql

## Część analityczno-statystyczna
Opracowano wykresy dla admina (ułatwiające analizę funkcjonowania warsztatu) oraz dla samochodu (pozwalające kontrolować historię zmiany przebiegu samochodu). 

### Wykresy dla administratora
- Wykres napraw i usług w wybranym okresie czasu,
- Wykres zarobków warsztatu w wybranym okresie.

### Wykres dla samochodu
- Wykres historii zmiany przebiegu samochodu.

## Dobór technologii

1. Baza danych
 - PostgreSQL 17 w wersji chmurowej,
 - nie wymaga żadnych dodatkowych instalacji ani konfiguracji.

2. Aplikacja
 - SpringBoot + Node.js,
 - instalacja: JDK, Gradle, Node.js,
 - konfiguracja środowiska: plik .env z parametrami do połączenia z bazą.

 ## Scenariusze i dane testowe

Wiekszość danych testowych została wprowadzona podczas testowania poszczególnych komponentów aplikacji.

## Uruchomienie projektu
Zalecane uruchomienie w aplikacji IntelliJ IDEA.

1. W folderze `frontend` należy zainstalować bibliotekę `yarn`, a następnie wpisać w terminalu polecenie:
```bash
yarn dev
```
2. W folderze `wsapi` należy umieścić plik `.env` oraz skonfigurować w aplikacji Spring Boot - WsapiApplication.
W sekcji `build and run` należy wpisać następujące opcje:
- java 22
- wsapi.main 
- com.workshop.wspai.WsapiApplication
<br>
Należy również dodać opcję `enviroment variables` i w nim podać ścieżkę do pliku `.env`.

## Potencjalne problemy
### 1. Port 8080 already in use  
Należy zakończyć proces zajmujący port 8080. 
- z poziomu menedżera zadań<br>
W zakładce `Szczegóły` szukamy procesu o nazwie `httpd.exe`. Klikamy na niego lewym przyciskim myszy, a następnie na opcję `Zakończ zadanie`.
- z poziomu terminala (Windows)<br>
Aby zidentyfikować proces używający portu 8080:

```bash
netstat -aon | findstr :8080
```

Wynik zawiera numer PID (ostatnia kolumna), np.:

```bash
TCP    0.0.0.0:8080     0.0.0.0:0     LISTENING     12345
```

Aby zakończyć ten proces:

```bash
taskkill /PID 12345 /F
```

- z poziomu terminala (Linux / macOS)<br>
Sprawdzenie procesu:

```bash
lsof -i :8080
```

Zakończenie procesu (np. o PID 12345):

```bash
kill -9 12345
```

### 2. IntelliJ nie znajduje WsapiApplication
Należy wejść w zakładkę `File` -> `Invalidate Caches`. Następnie w otworzonym okienku zatwierdzamy klikając przycisk `Invalidate and Restart`.
