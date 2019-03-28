<?php   //the parameters $xx{n} only to avoid E_STRICT error , but they are not used inside the child function
require _ELDEEB.'lib/data.php';
class MyData extends data{
public $root=_ELDEEB;        //nx:  _ROOT,_HROOT;
function enc($data,$from='WINDOWS-1256',$to='UTF-8'){return parent::enc($from,$to,$data);}
function upload($input,$path,$override=false,$types=[],$size=[],$xx1=null){$this->mkdir('uploads'); return parent::upload($input,'data/uploads/'.$path,$override,$types,$size);}
function uploadImg($input,$path,$override=false,$size=[],$xx1=[]){return $this->upload($input,$path,$override,['.jpg','.jpeg','.png','.gif'],$size);}
function del($f,$keep=false){$this->delete($f,$keep);}

/*
 examples:
 img(articles_cover/1,'default.jpg',true);
 img(articles_cover,$article,'default.jpg',true);
  img(articles_cover,$article,true);
*/
function img($path,$default=null,$info=true,$x=true){ //path=articles_cover/$sz/$id   nx:,$alt
  global $ui;
    $t='';
    if(is_array($default)){
      $path.='/'.$default['rowid'];
      $t=$ui->cleanLink($default,true);
      if(is_string($info)){$default=$info;$info=$x;}
      elseif(!empty($default['default']))$default=$default['default'];
      else $default=null;
    }elseif(is_bool($default)){$info=$default;$default=null;}
    $path='data/uploads/'.$path;
    $file=$this->root.$path.'.jpg';
    if(@file_exists($file))$img=_SROOT.$path.$t.'.jpg';elseif(!empty($default))$img=$default;else $img=NULL; //nx: replace _SROOT with $this->sroot
    if(!$info)return $img;
    if($img){
    $info=getimagesize($file); // getimagesize($img); sometimes failed on some servers i.e: don't use http://.. , use the file path on the server itself
    return array($img,$info[0],$info[1]);
    }
}

function imgs($dir,$r,$sizes=''){   //[$img=[src,w,h],$srcSet,$sizes]
     $img=$this->img($dir.'/orig',$r);
     if(!$img)return null;
     $opt=$this->img($dir.'/opt',$r);
     if($opt)$img=$opt;
     $srcSet='';
     $sz=[400,600,800,1000,1200];   //nx: if(!opt)use orig
     foreach($sz as $v){
         $s=$this->img($dir.'/'.$v,$r,false);
         if(!empty($s))$srcSet.=$s.' '.$v.'w,';
     }
    if(!empty($srcSet)){
         $img[]=$srcSet.' '.$img[0].' '.$img[1].'w';
         $img[]=$sizes;
    }
   return $img;

}
function ar($x=0){
 $n=['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
 $s=['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];
 if($x==1)return $n;
elseif($x==2)return $s;
// elseif($x==3)return array_merge($n,$s,['أ']);
 else return array_merge($n,$s);

}

function session($id,$data=[]){
  $d=explode('_', $id);
  if(!empty($d[1]))$d=ceil($d[0]/1000);else $d=ceil($d[0]/50); //temporary
  $f='data/sessions/'.$d.'/'.$id.'.json';
  if(is_array($data)){
  $this->mkdir(['sessions','sessions/'.$d]);     // var_dump($this->read($f,true));
  $r=$this->write($f,array_merge($this->read($f,true),$data));
  //if(_DOMAIN!='localhost')$d='www.'._DOMAIN;else $d='';
  //setcookie('ss',true,time()+(10*365*24*60*60),'/',$d);
  return $r;
  }elseif($data=='logoff'){
     if(!$ss)$ss=$this->read($f,true);
     if(!empty($ss['user'][0])&&!in_array($ss['user'][0],$ss['logins']))$ss['logins'][]=$ss['user'][0];
     $ss['user']=null;
     if($this->write($f,$ss))return true;//for ajax
  }
  if(empty($data)||$data!=$d)return []; //validate session
  return $this->read($f,true);
}


function resize($dir,$name,$size='all',$w=null,$f=null){//must include graphics.php
if($size=='all')$size=[400,600,800,1000,1200,'opt']; //xs,sm,md,lg,xl (sizes of image not screen) i.e if available.width>600px use image=800
elseif($size=='thumb')$size=[50,150,250]; //for profile pictures

if(is_array($size)){
    $r=[];
    foreach($size as $sz){if(!array_key_exists($sz,$r))$r[$sz]=$this->resize($dir,$name,$sz);}
    return $r;
}else{
$dir=_ELDEEB.'data/uploads/'.$dir.'/';
if(!@file_exists($dir.'orig/'.$name))return;
$gr=new graphics($dir.'orig/'.$name);   // var_dump($gr);  echo '<br />'.$img.'<hr />';
$dim=$gr->dimensions();
if(!$f)$f=@filesize($dir.'orig/'.$name);
if($size>$dim[0]||($size!='opt'&&$size==$dim[0]))return; //no need to resize the image
if($size!='opt'&&!$gr->scale($size))return;
@mkdir($dir.$size);
$new=$dir.$size.'/'.$name;
foreach([80,70,60] as $q){  //nx: $q=[80,70,60] sork DESC
if(!$gr->outPut(null,$dir.$size.'/'.$name,$q))return;
if(@filesize($new)<@filesize($dir.'orig/'.$name))return true;
}
@unlink($new); //no need to resize this image
}

}

function links($data,$opt=[]){
  //data may be string or DomDocument
   /*modify links:
   -add _blank,nofollow
   -cut text (if the text is link) (truncate) : a-domain only b-$n chars 3-remove query 4-auto $opt[cut]=domain|query|$n|auto
   - grab link info (title,description,image,..)
   - convert links to wedgets (youtube video, facebook post...)
   - put icon (favicon) before link text

   <iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FPictures.just%2Fvideos%2F1880273812015012%2F&show_text=1&width=560" width="560" height="426" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>
   */
   if(!array_key_exists('skip',$opt))$opt['skip']=[];
   //$opt['skip'][]=_DOMAIN;

   $d=$this->dom($data);
   if(!$d)return $data;
   $dom=$d->dom;
   $links=$d->get('a');  //nX: only if($link->text is not link)
   $length=$links->length;
   for($i=0;$i<$length;$i++){
     $link=$links->item($i);
     if(!$link)break;
     $href=$link->getAttribute('href');
     $domain=parse_url($href,PHP_URL_HOST);


     //if(preg_match('/(?:youtu\.be|youtube\.com)\/(?:watch\?(?:.*&)?v=|embed\/|v\/)([^\?&]+)/', $href,$m)){} //?v=123&list=xx ?list=xx&v=123
     if(in_array($domain,['youtube.com','www.youtube.com','m.youtube.com','youtu.be'])){
         $r=[];
         $parts = explode('?', $href);
         if(is_array($parts) && count($parts)>1){
            $params = explode('&', $parts[1]);
            if(isset($params) && !empty($params) && is_array($params)){
                foreach($params as $param){
                    $kv = explode("=", $param);
                    if(isset($kv) && !empty($kv) && is_array($kv) && count($kv)>1){
                        if($kv[0]=='v')$r['v']=$kv[1]; //11 chars
                        elseif(in_array($kv[0],['list','playlist']))$r['list']=$kv[1];
                    }
                }
            }

        }

     if(empty($r['v'])){
      // /embed|v/$id ->regex
      if(preg_match('/(?:watch\?(?:.*&)?v=|embed\/|v\/)([^\?&]+)/', $href,$m))$r['v']=$m[1];


     }



     if(!empty($r['v'])||!empty($r['list'])){ //i.e can be embeded
      if(empty($r['list']))$r['list']='PLji66B60Fq-MxCD_8S42D1dY6FVvG7Ikl&v=fZ9tvJI1KVw';  //FreeLearn popular videos "auto created by youtube" or PUvx82whwshh3WsPUs1zpOMw "created by me (needs to be updated every month)"
      $ifr=$dom->createElement('iframe');
      $ifr->setAttribute('data-src','https://www.youtube.com/embed/'.$r['v'].'?list='.$r['list']); //?list=...
      $ifr->setAttribute('width','560');
      $ifr->setAttribute('height','315');
      $ifr->setAttribute('style','width:560px;height:315px;');
      $ifr->setAttribute('frameborder','0');
      $ifr->setAttribute('allow','autoplay; encrypted-media');
      $ifr->setAttribute('allowfullscreen','true');
      $f=$d->fragment($ifr); //=$f=$d->fragment(); $f->appendChild($ifr);
      if($d->replace($link,$f))$i--; //when replacing the $link with a different tagName it is removed from DomNodeList, so we have to back one step
      //or  $d->fragment($ifr,$link,$true); but we need replace() value true/false

      /*
      $test=$dom->createTextNode('<iframe width="560" ="315" src="https://www.youtube.com/embed/fZ9tvJI1KVw" ="0" allow="" ></iframe>'); //will escape html
      $f=$d->fragment();
      //$f->appendXML($test);
      $f->appendChild($test);
      $d->replace($link,$f);
      */


     }




     }else{
      //convert link to preview widget contains: title,img,summary (fetch link info)
   if($domain==_HOST||$domain==_DOMAIN){ //nx: or any of its subdomains  or strstr($domain,_HOST); no need to add dofollow (also it is invaled value for rel attribute)
        $href='https://www.'.str_replace(['http://', 'https://','www.'],'', $href);
        $q=parse_url($href,PHP_URL_QUERY);
        if(!strstr($q,'utm='))$href.=(strpos($url,'?') === false?'?':'&').'utm_source=internal&utm_medium=article&utm_campaign=inside';
        $link->setAttribute('href',$href);
        if(!$link->hasAttribute(rel)||empty($link->getAttribute('rel')))$link->setAttribute('rel','prefetch'); //prefetch articles whitch is mentioned inside this article

   }elseif(!in_array($domain, $opt['skip'])){
      $link->setAttribute('target','_blank');
      $link->setAttribute('rel','nofollow');
     }
     }


   }
   return str_replace(['<xx>','</xx>'], '', $d->save());
}

function safe($data){ //nx:
  //safe html data , remove dangerous codes , sql injection , inline <syle><js><meta>
  /*
    remove unwanted elements: head,meta,script,style
    remove unwanted attributes
    extract <body> content and append it to $data
    add style="width:$attr(width);height..." to youtube iframe
    remove empty html tags
    check for any unsafe html code
    remove href="javascript:"


  */
  return $data;
}
function lazy($data){
   $d=$this->dom($data);
   if(!$d)return $data;
   $tags=['img','iframe'];
   foreach($tags as $tag){
    $el=$d->get($tag);
    foreach($el as $v){
      $attr=['src','srcSet'];
      foreach($attr as $x){
        if(!$v->hasAttribute('data-'.$x)&&$v->hasAttribute($x)){
        $v->setAttribute('data-'.$x,$v->getAttribute($x));
        $v->removeAttribute($x); //don't set src=""; because it will not lazy load the img
        //nx: add <noscript><$tag src=..></> http://jquery.eisbehr.de/lazy/example_disabled-javascript-fallback
        }
      }

    }
   }

 return str_replace(['<xx>','</xx>'], '', $d->save());
}

function clean($data,$br=false){ //cleanContent
  $data=trim($data);
  if(empty($data))return '';
  $data=$this->text($data);
  $data=$this->hyper($data);
  $data=$this->links($data);
  $data=$this->lazy($data);
  $data=$this->safe($data);
  $data=$this->voice_en($data); //$data=$this->voice($data);  voice_en():add .voice to any english sentence, voice():add .voice only to determined sentences by voice:
  if($br)return nl2br($data); else return $data;
}

function text($data){//convert plain text to html
  /*
    headers (2-4)
    #H2
    ## H3
    ### H5
    #n Hn (ex: #6 H6)
  */
  $data=preg_replace_callback('/^(<p>\s*)?#(#|[2-4])? (.*)/m', function($m){ //$this->print_r($m);
    /*
     to generalize this function , the line may starts with:
      # h1
      <p># h1 ..
      # h1 <br /> ## h2 (must explode <br> to PHP_EOL)
    */
    if($m[2]=='#')$tag='h3';else  $tag=!empty($m[2])?'h'.$m[2]:'h2';
    return $m[1].'<'.$tag.'>'.trim($m[3]).'</'.$tag.'>'.PHP_EOL;
  }, $data);
  return $data;
}

function voice_en($data){ return $data;
  //detect english scentences and add .voice class to them; this function will not called automaticcly, use it to prepare the article before submitting it

   $d=$this->dom($data);
   $dom=$d->dom;
   if(!$d||!$dom)return $data;
   $root=$dom->documentElement;
   if(!$root)return $data;

   function el($el,$d,$i=0){
         $childs=$el->childNodes;
         $length=$childs->length;
         if($length>0){ //=$el->hasChildNodes()  ;&&!$childs->item(0) instanceof DOMText <x>hello</x> has one child of type DomText
          $i=0;  $n=0;
          while($i<$length){ echo '<hr />';
            $el=$childs->item($i);  //var_dump($el); echo '<br /><br />';
            if(!$el)break;
            echo '(('.$el->tagName.'))'.$el->textContent.' '; /*var_dump($el);*/ echo '<br /><br />a:'.$i.'; '; $n++; if($n>5)break;
             //childs->length may be decreased due to replace()
           $i=el($el,$d,$i); echo 'c:'.$i.'; <br />';
          }

         // for($i=0;$i<$childs->length;$i++)$i=el($childs->item($i),$d,$i)+1;
         }else{
          //modify the content
          $text=$el->textContent; //var_dump($text); echo '<br />';
          if(empty($text))return $i+1; //<br /> or <hr />
          $voice=preg_replace_callback('#(?:[0-9 ]*[a-zA-Z]+[0-9,’.\'"\(\)\[\] ]*)+#', function($m){if(empty(trim($m[0])))return $m[0];else return '<span class="voice">'.$m[0].'</span>';},$text); //or: if(preg_match(..))$el->addClass('voice'); -> may contain non-english words
           //(?:[0-9 ]*[\w]*)+# will also replace numbers (if not inside a sentence)
          //replace $text with $voice
          //$el->nodeValue=$voice; //echo($voice); //(will escape html tags), also textContent

         if($voice!=$text){
           $x=$d->fragment($voice,$el,true); //or add the resutl to $r; //to set $replace=true we have to decrease the counter $i-- for($i=0;$i<$childs->length,..)
           if($x&&$el->tagName!='span')$i--;

         }
         echo 'b:'.$i.'; ';
           return $i+1;

         }
   }


    el($root,$d); //the root element i.e <xx>
    return $d->save();



  //return preg_replace_callback('#(?<=>)(?:[0-9 ]*[a-zA-Z]+[0-9 ]*)+#', function($m){if(empty(trim($m[0])))return $m[0];else return '<span class="voice">'.$m[0].'</span>';},$data);
  /*nx: only plain text (and not links) & don't create a child element
  ex: <div>hello</div> => <div .voice>hello</div> not <div><div .voice>hello</div></div>
      <a href="">hello</a> don't add .voice
  */
}
function voice($data){
  /*
   syntax:
   voice: hello
   voice:m; hello
   conv: name:english<br>ar<br>   name2:en<br>ar<br> /conv:
  */
 $arr = preg_split( '/(<[^<>]+>)/', $data, -1, PREG_SPLIT_DELIM_CAPTURE );
 $r=''; $x=''; $conv=false;

 foreach ( $arr as $v ) {
 // $v=trim($v); don't trim elements , to test: $this->voice('abc <a href="#">link</a> def'); will result abc"LINK"def without spaces
  if($conv&&substr($v,0, 3)=='<br')continue;
  if(substr($v, 0,6)=='voice:'){
    $v=trim(substr($v,6));
    $gender=substr($v, 0,2);
    if(in_array($gender,['f;','m;']))$v=trim(substr($v, 2));else $gender='';
    $r.='<div class="voice" '.(!empty($gender)?' data-gender="'.$gender[0].'"':'').'>'.$v.'</div>'; //nx:voice:f/m;text ; voice: <$tag>text</$tag> -> <$tag .voice>text</> ~DomDocument
  }
  elseif(substr($v,0,6)=='/conv:'){$r.='</div>';$x='';$conv=false;} //must be before if(item)
  elseif(substr($v,0,5)=='conv:'||$x=='item'){
    $conv=true;
    if($x!='item'){$v=substr($v, 5);$r.='<div class="conversation>';} //new conversation
    list($name,$en)=explode(':', $v);
    $r.='<div class="item"><div class="name">'.trim($name).' :</div><div class="en">'.trim($en).'</div>';$x='tr';}
    //elseif($x=='tr')$x='tr2'; //just ignore this element because it is a delimeter ; replaced with $conv=true to remove unused <br> inside <div .conversation> container
    elseif($x=='tr'){$r.='<div class="tr">'.$v.'</div></div>';$x='item';} //go to next item

  else $r.=$v;
 }
  /* nx:
 while($arr){
  if(conv:){
     <.conv><.item>....</>
     tr=next($arr); <.tr>$v</>
     next($arr); if(!=/conv)create new item else </.conv>
  }
 }

 */
 return $r;
}

function wp($path='',$post=[],$x=null){
if(count($post)>0)$post['login']=['xxyyzz2050','Xx159753@@'];
return parent::wp('http://www.almogtama3.com/wp/',$path,$post);
}

function p($datam,$hr=1){return parent::print_r($data,$hr);}

function dom($data){
  require_once _ELDEEB.'lib/dom.php';  //dirname(__DIR__).'dom.php'dirname(__DIR__).'dom.php' ;if(!class_exists('dom'))require ...
     /* if(!$data instanceof DOMDocument){
       $data="<temp>$data</temp>";
       if(!empty($opt['encoding']))$data=new DomDocument(null,$opt['encoding']);
       else $data=new DomDocument;
   }*/
  if(is_string($data))$data='<xx>'.mb_convert_encoding($data, 'HTML-ENTITIES', 'UTF-8').'</xx>';
  $d=new dom($data,'UTF-8');
  return $d;

}


//---------------------------------Done converted to Node.js ---------------------------------//
function cache($file,$func,$time=null,$type=null,$params=null){if(isset($_GET['refresh']))@unlink($this->root.'tmp/'.$file);$this->tmp();return parent::cache('tmp/'.$file,$func,$time,$type,$params);}
function mkdir($path='',$xx1=null,$xx2=null){parent::mkdir('data'); if(is_array($path)){foreach($path as $k=>$v){parent::mkdir('data/'.$v);}}else parent::mkdir('data/'.$path);}
function data($path=''){$this->mkdir($path);}
function tmp($path='',$xx1=null,$xx2=null){parent::mkdir('tmp'); if(is_array($path)){foreach($path as $k=>$v){parent::mkdir('tmp/'.$v);}}else parent::mkdir('tmp/'.$path);}

}
return new MyData();
?>
