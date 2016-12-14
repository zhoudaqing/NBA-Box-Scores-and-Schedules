/**
 * Corresponding field headers in nba_schedule.txt
 */
const FieldHeader = {
  GAME_ID: 0,
  DATE: 1,
  AWAY_TEAM: 2,
  HOME_TEAM: 3
};

/**
 * Image names for each team logo
 */
const teamLogos = {
  'Atlanta Hawks'          : 'img/atl.png',
  'Boston Celtics'         : 'img/bos.png',
  'Brooklyn Nets'          : 'img/bkn.png',
  'Charlotte Hornets'      : 'img/cha.png',
  'Chicago Bulls'          : 'img/chi.png',
  'Cleveland Cavaliers'    : 'img/cle.png',
  'Dallas Mavericks'       : 'img/dal.png',
  'Denver Nuggets'         : 'img/den.png',
  'Detroit Pistons'        : 'img/det.png',
  'Golden State Warriors'  : 'img/gsw.png',
  'Houston Rockets'        : 'img/hou.png',
  'Indiana Pacers'         : 'img/ind.png',
  'Los Angeles Lakers'     : 'img/lal.png',
  'LA Clippers'            : 'img/lac.png',
  'Memphis Grizzlies'      : 'img/mem.png',
  'Miami Heat'             : 'img/mia.png',
  'Milwaukee Bucks'        : 'img/mil.png',
  'Minnesota Timberwolves' : 'img/min.png',
  'New Orleans Pelicans'   : 'img/nol.png',
  'New York Knicks'        : 'img/nyk.png',
  'Oklahoma City Thunder'  : 'img/okc.png',
  'Orlando Magic'          : 'img/orl.png',
  'Philadelphia 76ers'     : 'img/phi.png',
  'Phoenix Suns'           : 'img/phx.png',
  'Portland Trail Blazers' : 'img/por.png',
  'Sacramento Kings'       : 'img/sac.png',
  'San Antonio Spurs'      : 'img/sas.png',
  'Toronto Raptors'        : 'img/tor.png',
  'Utah Jazz'              : 'img/uth.png',
  'Washington Wizards'     : 'img/was.png'
};

/**
 * Constructs ajax URL
 * @param url to view page source
 * @return ajax url
 */
function ajaxUrl(url) {
  return 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22'
    + url + '%22&diagnostics=true';
}

/**
 * Clears box score
 */
function clearBoxScore() {
  $('#boxscore').empty().css('text-align', '');
}

/**
 * Clears footer
 */
function clearFooter() {
  $('#espn').empty();
  $('#espn').unbind('click');
}

/**
 * Clears list of games
 */
function clearGames() {
  $('#games').empty();
}

/**
 * Clears page
 */
function clearPage() {
  clearBoxScore();
  clearFooter();
  clearGames();
}

/**
 * Get the away team given the response
 * @param page source in text format
 * @return away team (i.e. Los Angeles Lakers)
 */
function getAwayTeam(response) {
  var el = $($.parseHTML(response));
  return el.find('.long-name:eq(0)').text() + ' ' + el.find('.short-name:eq(0)').text();
}

/**
 * Get the away team record given the response
 * @param page source in text format
 * @return away team record (i.e. 24-0)
 */
function getAwayTeamRecord(response) {
  var record = $($.parseHTML(response)).find('.record:eq(0)');
  record.find('.inner-record').remove();
  return record.text();
}

/**
 * Get the away team score given the response
 * @param page source in text format
 * @return away team score (i.e. 100)
 */
function getAwayTeamScore(response) {
  var score = $($.parseHTML(response)).find('.score:eq(0)').text();
  return score != '' ? score : '--';
}

/**
 * Get today's date in format January 1, 1970
 * @return date
 */
function getFormattedDate(date) {
  var month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
    'September', 'October', 'November', 'December'];
  return month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

/**
 * Get game time given the response
 * @param page source in text format
*/
function getGameTime(response) {
  var el = $($.parseHTML(response));
  return el.find('.game-time').text();
}

/**
 * Get the home team given the response
 * @param page source in text format
 * @return home team (i.e. Los Angeles Lakers)
 */
function getHomeTeam(response) {
  var el = $($.parseHTML(response));
  return el.find('.long-name:eq(1)').text() + ' ' + el.find('.short-name:eq(1)').text();
}

/**
 * Get the home team record given the response
 * @param page source in text format
 * @return home team record (i.e. 24-0)
 */
function getHomeTeamRecord(response) {
  var record = $($.parseHTML(response)).find('.record:eq(1)');
  record.find('.inner-record').remove();
  return record.text();
}

/**
 * Get the home team score given the response
 * @param page source in text format
 * @return home team score (i.e. 100)
 */
function getHomeTeamScore(response) {
  var score = $($.parseHTML(response)).find('.score:eq(1)').text();
  return score != '' ? score : '--';
}

/**
 * Load boxscore into boxscore element
 * @param page source in text format
 */
function loadBoxScore(response) {
  clearBoxScore();
  var boxscore = $($.parseHTML(response)).find('#gamepackage-box-score').html();
  if (boxscore.includes('No Box Score Available')) {
    $('#boxscore')
      .append($('<span>', {'id' : 'no-boxscore'}).html(boxscore))
      .css('text-align', 'center');
  } else {
    $('#boxscore').html(boxscore);
  }
}

/**
 * Set current date in the header; move 3 hours back to account for late games
 * @param current date
 */
function setCurrentDate(date) {
  date.setHours(date.getHours() - 3);
  $('#date').text(getFormattedDate(date));
}
