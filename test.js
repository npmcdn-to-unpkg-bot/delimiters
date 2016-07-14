var $main = $('.main')

var list = [1,2,3,4,5]

var table = ('<table class="table"><th>id<th><th>other</th></table>');
$main.append(table)

function makeRows (data) {
  return data.map(function(id){
    return (
        '<tr class="' + id + '">' +
        '<td>' + id + '</td>' +
        '</tr>'
      );
  });
}

$table = $('.table').append(makeRows(list));


console.log($table)