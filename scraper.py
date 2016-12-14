# use find_pdfs() to print all courses into a file output.txt taken from input page_source.txt
# use filter() to filter output.txt to find all pdf only courses

from bs4 import BeautifulSoup
import sys
import time
import urllib2

def main():
    start = int(sys.argv[1])
    # end = int(sys.argv[2])
    # print (time.strftime('%B %-d, %Y'))

    # ex: 400899375 400900608
    print 'Game_ID/Date/Away_Team_Name/Home_Team_Name'
    for gameId in range(start, start + 200):
        url = 'http://www.espn.com/nba/boxscore?gameId=' + str(gameId);
        html = urllib2.urlopen(url).read()
        soup = BeautifulSoup(html, 'html.parser')
        print '/'.join([str(gameId), date(soup), awayTeam(soup), homeTeam(soup),])

# Get date
# Format: <title>Jazz vs. Lakers - Box Score - December 5, 2016 - ESPN</title>
def date(soup):
    title = soup.findAll('title')
    return title[0].text.split(' - ')[2] if title else ''

# Get away team
# Format: <span class='long-name'>Los Angeles</span>, <span class='short-name'>Lakers</span>
def awayTeam(soup):
    longName = soup.findAll('span', {'class' : 'long-name'})
    shortName = soup.findAll('span', {'class' : 'short-name'})
    return (longName[0].text if longName else '')  + ' ' + (shortName[0].text if shortName else '')

# Get home team
# Format: <span class='long-name'>Los Angeles</span>, <span class='short-name'>Lakers</span>
def homeTeam(soup):
    longName = soup.findAll('span', {'class' : 'long-name'})
    shortName = soup.findAll('span', {'class' : 'short-name'})
    return (longName[1].text if longName else '') + ' ' + (shortName[1].text if shortName else '')

main()