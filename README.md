# Movistar-Contests
## Introduction
Movistar-Contests is a project to automate the web-process of submitting entries in a contest from Movistar (Club-Movistar page) using web scrapping with puppeteer in node js. The chosen contest has to be identified by the text presented in the web page and should allow multiple entries. 

This project was born due to the frustration of doing this process by hand because of the bad user experience of Movistar's site.

Movistar-Contests main objective is to learn to use web-scrappers for web automatation, have fun doing so and maybe win some contests :money_mouth_face: .

## Usage
In order to use this program, you need to have a movistar user. This info and more should be included in a .env file located on the same directory of the project. This .env file should contain the following information (presented along with a description which should not be included in the actual file):

- RUT => Chilean tax identification number of the movistar user.
- PASSWORD => Password of the movistar user.
- NAME => Name of the person that is participating in the contest.
- LAST_NAME => Last name of the person that is participating in the contest.
- RUT2 => RUT (chilean tax identification number) of the person that is participating in the contest.
- EMAIL => Email of the person that is participating in the contest.
- PHONE => Phone of the person that is participating in the contest.
- AMOUNT => Amount of entries to be made.
- CONTEST_TEXT => Text shown is club-movistar page to identify which contest to choose.
- HEADLESS => "false" to show process in a chromium browser and "true" to hide it.

It should look something like this:

    RUT="123456789"
    PASSWORD="somepassword"
    NAME="John"
    LAST_NAME="Doe"
    RUT2="98765432"
    EMAIL="johndoe@fakeemail.com"
    PHONE="56912345678"
    AMOUNT="10"
    CONTEST_TEXT="concurso movistar arena 28 de enero"
    HEADLESS="false"

## Others
This is an early version of the project and could present some bugs.

If you are reading this, feel free to test and use this project. However, don't share this project to much, so we have more chances to win some contests.