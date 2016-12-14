/**
 * On DOM load
 */
document.addEventListener('DOMContentLoaded', function() {
  var currentDate = new Date();
  setCurrentDate(currentDate);

  $('#prevDate').click(function() {
    currentDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(currentDate);
    clearPage();
    loadGames();
  });

  $('#nextDate').click(function() {
    currentDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(currentDate);
    clearPage();
    loadGames();
  });

  loadGames();
});

/**
 * Load a single game based on game id
 * @param game id, away team, home team
 */
function loadGame(gameId, awayTeam, homeTeam) {
  var li = $('<li>').append(
              $('<img/>', {'class':'away-team logo', 'src':teamLogos[awayTeam]}),
              $('<span>', {'class':'away-team label'}).text(awayTeam),
              $('<span>', {'class':'away-team record'}),
              $('<span>', {'class':'away-team score'}).text('--'),
              $('<br>'),
              $('<img/>', {'class':'home-team logo', 'src':teamLogos[homeTeam]}),
              $('<span>', {'class':'home-team label'}).text(homeTeam),
              $('<span>', {'class':'home-team record'}),
              $('<span>', {'class':'home-team score'}).text('--')
            );
  $('#games-list').append(li);

  $.ajax({
    url: ajaxUrl('http://www.espn.com/nba/boxscore?gameId=' + gameId),
    type: 'GET',
    dataType: 'text',
    success: function(response) {
      li.click(function() {
        loadBoxScore(response);
        $('html, body').animate({scrollTop: $('#boxscore').offset().top}, 300);
        clearFooter();
        $('#espn')
          .text('ESPN Summary: ' + awayTeam + ' @ ' + homeTeam)
          .click(function() {
            chrome.tabs.create({url: 'http://www.espn.com/nba/game?gameId=' + gameId});
          }); 
      });
      setScoresRecordsAndGameTime(response, li);
    }
  });
}

/**
 * Load all games for current date
 */
function loadGames() {
  var date = $('#date').text();
  $('#games').append($('<ul>', {'id':'games-list'}));
  $.get('nba_schedule.txt', function(text) {
    var data = text.split('\n');
    data.forEach(function(d) {
      fields = d.split('/');
      if (fields[FieldHeader.DATE] == date) {
        loadGame(fields[FieldHeader.GAME_ID], fields[FieldHeader.AWAY_TEAM], 
          fields[FieldHeader.HOME_TEAM]);
      }
    });
    if (!$('#games li').length) {
      $('#games')
        .empty()
        .append(
          $('<br>'),
          $('<span>', {'id':'no-games'}).text('No games scheduled'))
        .css('text-align', 'center');
    } else {
      $('#games').css('text-align', 'left');
    }
  });
}

/**
 * Set scores and game time for a given game given a response
 * @param page source in text format + jquery list element
 */
function setScoresRecordsAndGameTime(response, li) {
  var awayTeamScore = getAwayTeamScore(response);
  var homeTeamScore = getHomeTeamScore(response);
  var gameTime = getGameTime(response);

  li.find('.away-team.record').text(getAwayTeamRecord(response));
  li.find('.home-team.record').text(getHomeTeamRecord(response));
  li.find('.away-team.score').text(awayTeamScore);
  li.find('.home-team.score').text(homeTeamScore);

  if (gameTime != '' && awayTeamScore != '--' && homeTeamScore != '--') {
    if (gameTime.includes('Final')) {
      if (parseInt(awayTeamScore) > parseInt(homeTeamScore)) {
        li.find('.away-team.label').addClass('won');
        li.find('.away-team.score').addClass('won');
      } else {
        li.find('.home-team.label').addClass('won');
        li.find('.home-team.score').addClass('won');
      }
    } else {
      if (parseInt(awayTeamScore) > parseInt(homeTeamScore)) {
        li.find('.away-team.score').addClass('winning');
      } else {
        li.find('.home-team.score').addClass('winning');
      }
      li.append(
        $('<br>'),
        $('<span>', {'class':'game-time'}).text(gameTime),
        $('<br>')
      );
    }
  }
}
