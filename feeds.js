function previewFile(input) {
  var files = $("input[type=file]").get(0);
  $.each(files.files, function (i, file) {
    console.log(file);
    if (file) {
      var reader = new FileReader();
      $(".attachments").append(
        "<img class='priview-image' src='" +
          window.URL.createObjectURL(file) +
          "' >"
      );
      reader.onload = function () {
        $("#previewImg").attr("src", reader.result);
      };

      reader.readAsDataURL(file);
    }
  });
}
function gbDidSuccessGetUser(user) {
  sessionStorage.setItem("user", user);
  saveuser();
}

function saveuser() {
  userinfo = JSON.parse(sessionStorage.getItem("user"));
  get_listings();
  $request = {
    action: "save-user",
    userId: userinfo.userId,
    displayName: userinfo.displayName,
    email: userinfo.email,
    location: userinfo.location,
    photoUrl: userinfo.photoUrl,
    userName: userinfo.userName,
  };
  $.post(server, $request, function (data) {
    console.log(data);
  });
}
function get_listings(){
 
    $(".listings").html("")
      user = JSON.parse(sessionStorage.getItem('user')) 
          $request = {
              'action' : 'get-post',
              'user_id': user.userId
          }
          $.post(server,$request, function(data){ 
  console.log(data)
            $.each(data,function(i,v){
                 if(!v.photoUrl){ v.photoUrl = "https://image.shutterstock.com/image-vector/user-icon-trendy-flat-style-260nw-418179865.jpg";}
                 if(!v.total_likes){v.total_likes=0}
                 if(!v.is_liked || v.is_liked==0){likeicon = '<i class="bi bi-hand-thumbs-up"></i> Like'}else{likeicon = '<i class="bi bi-hand-thumbs-up-fill"></i> Liked'}
                 attachments = JSON.parse(v.attachments);
                
                 html = '<div class="card">'+
                  '<div class="card-header"><img src="'+v.photoUrl+'" class="profile-pic" >'+v.displayName+'</div>'+
                  '<div class="card-body">'+
                    '<blockquote class="blockquote mb-0">'+
                      '<p>'+v.post+'</p>';
                     $.each(attachments, function(i,a){
                       html += '<img src="'+server+a+'" />'
                     })
  
                     html += '<footer><i class="bi bi-bookmark"></i> '+v.total_likes +' people Like</footer>'+
                      '<hr>'+
                      '<div class="row">'+
                      '<a style="text-align:center;font-size: 15px;" onclick="makelike('+v.id+', '+user.userId+')" class="col">'+likeicon +'</a>'+
                      '<a style="text-align:center;font-size: 15px;" onclick="makeComments('+v.id+', '+user.userId+')"  data-bs-toggle="modal" data-bs-target="#post-reply" class="col"><i class="bi bi-chat-left-dots"></i> Comment</a>'+
   
                      '<a style="text-align:center;font-size: 15px;" class="col"><i class="bi bi-three-dots-vertical"></i></a>'+
                      '</div>'+
                    '</blockquote>'+
                 ' </div>'+
                '</div>'
                $(".listings").append(html)
            })
            
          })
  }
  function post_now(){
    user = JSON.parse(sessionStorage.getItem('user')) 
             
    
            var fd = new FormData();
            //var files = $("#file-input")[0].files[0];
            var files = $("#file-input")[0].files;
  
            $.each(files, function(i,v){
            files = v;
            fd.append('file_'+i, files);
          }); //each end
            fd.append('action', "make-post");
            fd.append('user_id', user.userId,);
            fd.append('post', $("#post").val());
            fd.append('post_for', $("input[name=post_for]").val());
            console.log(fd)
            $.ajax({
                    url: server,
                    type: 'post',
                    data: fd,
                    contentType: false,
                    processData: false,
                    cache : false,
                    success: function(response){                    
                        if(response.status== 200){
                          $('#exampleModal').modal('hide'); 
                          $('.post-new').hide()
                        }
                        else{
                            alert('Error on Submit...');
                        }
                    },
          });
      
            
          
      }
  function makelike(post_id,user_id){
   $request = {
              'action' : 'like-post',
              'userId': user.userId,
              'postId': post_id,                 
          }
          $.post(server,$request, function(data){
            console.log(data)  
            get_listings()       
          })
  
  }
  function makeComments(post_id,user_id){
    $(".old-comments").html("");
    $(".main-post").html("")
    $('#userId').val(user_id);
    $('#postId').val(post_id);
    $request = {
      'action' : 'getpostbyid',    
      'postId': post_id,  
      'userId': user_id,              
        }
        $.post(server,$request, function(data){
          console.log(data)  
  v = data;     
                 if(!v.photoUrl){ v.photoUrl = "https://image.shutterstock.com/image-vector/user-icon-trendy-flat-style-260nw-418179865.jpg";}
                 if(!v.total_likes){v.total_likes=0}
                 if(!v.is_liked){likeicon = '<i class="bi bi-hand-thumbs-up"></i> Like'}else{likeicon = '<i class="bi bi-hand-thumbs-up-fill"></i> Liked'}
                html = '<div class="card">'+
                  '<div class="card-header"><img src="'+v.photoUrl+'" class="profile-pic" >'+v.displayName+'</div>'+
                  '<div class="card-body">'+
                    '<blockquote class="blockquote mb-0">'+
                      '<p>'+v.post+'</p>'+
                      '<footer><i class="bi bi-bookmark"></i> '+v.total_likes +' people Like</footer>'+
                      '<hr>'+
                      '<div class="row">'+
                      '<a style="text-align:center;font-size: 15px;" onclick="makelike('+v.id+', '+user.userId+')" class="col">'+likeicon +'</a>'+       
                      '<a style="text-align:center;font-size: 15px;" class="col"><i class="bi bi-three-dots-vertical"></i></a>'+
                      '</div>'+
                    '</blockquote>'+
                 ' </div>'+
                '</div>'  
              $(".main-post").html(html)
               
              $.each(v.comments,function(i,v){
  
                comment = '<div class="card">'+
                  '<div class="card-header"><img src="'+v.photoUrl+'" class="profile-pic" >'+v.displayName+'</div>'+
                  '<div class="card-body">'+
                    '<blockquote class="blockquote mb-0">'+
                      '<p>'+v.comment+'</p>'+                   
                    '</blockquote>'+
                 ' </div>'+
                '</div>' 
    
                $(".old-comments").append(comment);
  
              })
        })
  }
  function reply_now(){
    $request = {
      'action' : 'reply-post',
      'userId': $('#userId').val(),
      'postId': $('#postId').val(),
      'comment':$('#post-replay').val()            
      }
      $.post(server,$request, function(data){
        console.log(data)   
        $('#post-reply').modal('hide');        
      })
  }