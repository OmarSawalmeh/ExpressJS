
//jquery
$(document).ready(function(){
    $('.deleteUser').on('click', deleteUsers);
});

function deleteUsers(){
    let confirmation = confirm('Are You Sure?');
    if(confirmation){
        $.ajax({
            type:'DELETE',          // this inested '.deleteUser' to delete specifc id 
            url: '/users/delete/'+$(this).data('id')
        }).done(function(respnse){
            window.location.replace('/');
        });
        window.location.replace('/');
    }else{
       return false; 
    }
}

