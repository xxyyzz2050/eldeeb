<?php
class data{
 //class to handle data & files & strings & arrays ,....

function read($f,$json=false,$ssl=false){   //to return an array of lines , use file()
if(!function_exists('file_get_contents'))return;
$f=trim($f);
if(substr($f,0,4)=='http'||substr($f,0,3)=='ftp'){
    $mode='url';
    if(substr($f,0,8)=='https://'||substr($f,0,7)=='ftps://')$ssl=true;
}
elseif(substr($f,0,2)=='//'){$f='http://'.$f;$mode='url';} //nx: $f=$scheme.$f;
else {$f=$this->root.$f;$mode='file';}
//echo '<hr />f: '.$f.'<br />mode: '.$mode.'<br />ssl: '.$ssl.'<hr />';
if($mode=='url'){
    if(!ini_get('allow_url_fopen'))return;
    if($ssl){
      if(!function_exists('stream_get_wrappers'))return; //||!in_array('http', stream_get_wrappers()
      else $f=@file_get_contents($f, false, stream_context_create(['ssl'=>['verify_peer'=>false,'verify_peer_name'=>false]]));  //if the file is https, so file_get_contents() may return false (even if it worked with the same url with http)
    }else $f=@file_get_contents($f);

}else $f=@file_get_contents($f);
//if(!file_exists($f)){if($json)return [];else return;}


if(!$json)return $f;
if(empty($f))return [];
$f=@json_decode($f,true);
if($f)return $f;else return []; //nx: if faild must return null to follow errors
if($json)return @json_decode(@file_get_contents($f),true);
}

function file($f,$e=false){ //this function is good for in_array($x,$file)
$f=$this->root.$f;
if($e)return @file($f,FILE_IGNORE_NEW_LINES|FILE_SKIP_EMPTY_LINES);else return @file($f,FILE_IGNORE_NEW_LINES);
}

function write($f,$data,$add=false,$line=false){
$f=$this->root.$f;
if(is_array($data))$data=json_encode($data);
if($line)$data.=PHP_EOL;
if($add===1)return @file_put_contents($f,@file_get_contents($f).$data);
elseif($add)return @file_put_contents($f,$data,8);
else return @file_put_contents($f,$data);
}

function json($x,$read=false){
if($read)return $this->read($x,true);
if(is_string($x))return @json_decode($x,true);
elseif(is_array($x))return @json_encode($x);
}

function get($url,$curl_opt=[],$read_opt=[]){  //or getData()
  if($curl_opt[3]!==false)$curl_opt[3]=true; //...$curl_opt will make $string=false, the default is true
  $data=$this->read($url,...$read_opt);
  if(!$data)$data=$this->curl($url,...$curl_opt);
  if(!$data||!empty($this->curl_error)){ //try fsocket
    $fp = null;
        //try $fp=fsockopen('ssl://...') then fsockopen('tcp://...')
  }

  return $data;
  }


function print_r($a,$hr=true){
 echo '<pre>'; print_r($a); echo '</pre>'; if($hr)echo '<hr />';
}

function date($timestamp=null,$time=true,$seconds=false){
if($timestamp==null)$timestamp=time();
if($time)$q=' g:i'.($seconds?':s':'').' a P';else $q='';
return date('j/n/Y'.$q,$timestamp);
}

function enc($data,$from,$to='UTF-8'){
if($from=='ar')$from='WINDOWS-1256';
return iconv($from,$to,$data);
}
//function utf($data,$from)




function upload($input,$path,$override=false,$types=[],$size=[],$i=null){  // echo '<pre>';print_r($_FILES);   die();
//$override: false=don't copy , true=override , 1=rename
$f=$_FILES[$input];      //for multiple : path will be exists after the first move()
if($i===null){
if(is_array($f['name'])){
$r=[]; //results : errors=[size,type,exists] ,name=[new,old]
$c=count($f['name']);
for($k=0;$k<$c;$k++){$r[]=self::upload($input,$path,$override,$types,$size,$k);}//nx
return $r;
}else $path=$this->root.$path;

if(empty($f['name']))return;
if($f['error']!=0)return ['error'=>1,'msg'=>'server error']; //1=error by $_FILES
if(!empty($size[0])&&$f['size']<$size[0])return ['error'=>2,'msg'=>'large file','info'=>$f['size']];
if(!empty($size[1])&&$f['size']>$size[0])return ['error'=>3,'msg'=>'small file','info'=>$f['size']];
$type=strtolower(strrchr($f['name'],'.'));
if(count($types)>0&&!in_array($type,$types))return ['error'=>4,'msg'=>'type','info'=>$type];//nx: types , extensions , keywords
if(@file_exists($path)){
if(!$override)return ['error'=>5,'msg'=>'file exists','info'=>$path];
elseif($override===1)while(@file_exists($path)){$path=preg_replace('#(.+)(\..+)$#','$1_'.time().'_'.rand(1,500).'$2',$path);} //auto rename ; user can rename the file after uploading as needed; nx: apply replacement pattern [x,y]}

}

if(!@move_uploaded_file($f['tmp_name'],$path))return ['error'=>6,'msg'=>'move']; //cannot move the uploaded file
return ['error'=>0,'name'=>$f['name'],'path'=>$path,'size'=>$f['size'],'ext'=>$type]; //nx: ,type=image/jpeg
}else{
if(empty($f['name'][$i]))return;
if($f['error'][$i]!=0)return ['error'=>1,'msg'=>'server error']; //1=error by $_FILES
if(!empty($size[0])&&$f['size'][$i]<$size[0])return ['error'=>2,'msg'=>'large file','info'=>$f['size']];
if(!empty($size[1])&&$f['size'][$i]>$size[0])return ['error'=>3,'msg'=>'small file','info'=>$f['size']];
$type=strtolower(strrchr($f['name'][$i],'.'));
if(!empty($types))if(!in_array($type,$types))return ['error'=>4,'msg'=>'type','info'=>$type];//nx: types , extensions , keywords
if(is_file($path))return ['error'=>5];  //nx: exists: 1=override , null=continue , else = rename pattern
if(!@move_uploaded_file($f['tmp_name'][$i],$path))return ['error'=>6,'msg'=>'move'];
return ['error'=>0,'name'=>$f['name'][$i],'path'=>$path,'size'=>$f['size'],'ext'=>$type];
}
}


function day($time=null){
    /*if($time===null)return self::day(time());
    elseif($time[0]=='+'||$time[0]=='-')return self::day()+$time;
    elseif($time=='yesterday')return self::day()-1;
    elseif($time=='tomorrow')return self::day()+1;
    else return floor($time/(24*60*60));*/
    if(empty($time))$time=time();
    return floor($time/(24*60*60));
    }

function delete($f,$keep=false){//delets a file or folder or pattern
if(is_dir($this->root.$f)){
    $sc=scandir($this->root.$f);
    $r=array();
    if(substr($f, -1)!='/')$f.='/';
    foreach($sc as $v){if($v!=='.'&&$v!=='..')$r[$v]=self::delete($f.$v,false);} //if $v folder remove it and its contents
    if(!$keep)return @rmdir($this->root.$f);
    return $r;  //if(folder deleted)return true/false else return $r[dir=>true/false , files=>[a=>true,b=>false]]
}elseif(is_array($f)){
    $r=array();
    foreach($f as $v)$r[$v]=self::delete($v);
    return $r;
}elseif(is_file($this->root.$f))return @unlink($this->root.$f);
elseif(is_string($f))return array_map([self,'delete'], glob($f));//nx [$this,'delete]?? //delete all files in a directory matching a pattern
}

function agent($u_agent=null,$bot=1,$browser=true){ //client();
if(is_numeric($u_agent)){$bot=$u_agent;$u_agent='';} //bot: 0=dont detect bot; 1=detect ; 2=deep detect (get full info) ;$browser: true=detect browser
if(empty($u_agent))$u_agent=strtolower($_SERVER['HTTP_USER_AGENT']);

$agent=array('bot'=>null,'os'=>[],'ip'=>$_SERVER['REMOTE_ADDR'],'proxy'=>false,'text'=>$u_agent,'referrer'=>$_SERVER['HTTP_REFERER'],'port'=>$_SERVER['SERVER_PORT']); //nx: or ports=>[$_SERVER['SERVER_PORT'],$_SERVER['REMOTE_PORT']]  ,secure=>true/false (i.e https) ,file,query

//Client type
//nx: if($bot>0)
if(preg_match('/bot|crawl|slurp|spider|facebookexternalhit/i',$u_agent)){
 $agent['bot']=[]; //nx:[$site,$service] ex: [google,developers]   if($bot==2)
 return;
}
  //Operating System & Device
    if(!$browser)return null;
    if (preg_match('/android/i', $u_agent,$match)){$agent['os'][]='android';$agent['device']='mobile';}
    elseif (preg_match('/linux/i', $u_agent,$match)){$agent['os'][]='linux';$agent['device']='pc';}
    elseif (preg_match('/Window Mobile|Windows Phone/i', $u_agent,$match)){$agent['os'][] = 'windows mobile';$agent['device']='mobile';}
    elseif (preg_match('/Window/i', $u_agent,$match)){$agent['os'][] = 'windows';$agent['device']='pc';}
    elseif (preg_match('/macintosh|mac os x/i', $u_agent,$match)){$agent['os'][] = 'mac';$agent['device']='pc';}
    elseif (preg_match('/windows|win32/i', $u_agent,$match)){$agent['os'][] = 'windows';$agent['device']='pc';}
    elseif (preg_match('/blackberry|\bBB10\b|rim /i', $u_agent,$match)){$agent['os'][] = 'blackberry';$agent['device']='mobile';}
    elseif (preg_match('/Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\bS60\b/i', $u_agent,$match)){$agent['os'][] = 'nokia';$agent['device']='mobile';}
    elseif (preg_match('/iPhone|\iPod|\iPad/i', $u_agent,$match)){$agent['os'][] = 'iOS';$agent['device']='mobile';}


    //Browser
   $browsers =array('firefox', 'msie', 'opera', 'chrome', 'safari', 'mozilla', 'seamonkey', 'konqueror', 'netscape','gecko', 'navigator', 'mosaic', 'lynx', 'amaya', 'omniweb', 'avant', 'camino', 'flock', 'aol');
    foreach($browsers as $v) {
        if (preg_match('/('.$v.')[\/ ]?([0-9.]*)/', $u_agent, $match)) {
        //$agent['browser']=explode('/',$match[0]);
        $agent['browser'][]= $match[1];  //Browser  name
        $agent['browser'][] = $match[2]; //Browser version
       break;
      }
    }

 //Next: OS details : name ,version
 $agent['os'][]=""; //xp , 7 ,....

 //check if the client using peoxy
 $proxy_headers = array('HTTP_VIA','HTTP_X_FORWARDED_FOR','HTTP_FORWARDED_FOR','HTTP_X_FORWARDED','HTTP_FORWARDED','HTTP_CLIENT_IP','HTTP_FORWARDED_FOR_IP','VIA','X_FORWARDED_FOR','FORWARDED_FOR','X_FORWARDED','FORWARDED','CLIENT_IP','FORWARDED_FOR_IP','HTTP_PROXY_CONNECTION');
 foreach($proxy_headers as $v){if(isset($_SERVER[$v])){$agent['proxy']=true;break;}}
//$ports = array(8080,80,81,1080,6588,8000,3128,553,554,4480);
//foreach($ports as $v) {if(@fsockopen($ip,$v)){$agent['proxy']=true;break;}}  //this validate that proxy works , but i don't know if it checks for proxy or not
return $agent;
}

function trim($x,$y=null){
    if(is_array($x)){
        foreach($x as $k=>$v){
            if($y=='p')$x[$k]=trim($_POST[$v]);
            elseif($y=='g')$x[$k]=trim($_GET[$v]);
            else $x[$k]=$this->trim($v);
        }
        return $x;
    }elseif(is_string($x)) return trim($x);
    else return $x;
}

function curl($url,$opts=[],$data=[],$args=[],$string=true){   //post must be array (to add headers)
if (!function_exists('curl_init')||empty($url))return;
$ch = curl_init($url);
if(!empty($args['login'][0])){
    curl_setopt($ch, CURLOPT_USERPWD, $args['login'][0].':'.$args['login'][1]);
    if($args['login'][2])$data['headers']['Authorization']='Basic '.base64_encode($data['login'][0].':'.$data['login'][1]);//also add BasicAuth to header
    }
foreach($opts as $k=>$v){if($k=='headers')$k=CURLOPT_HTTPHEADER;if(is_string($k)){ if(!strstr('CURLOPT_',$k))$k='CURLOPT_'.$k;}$k=constant(strtoupper($k));curl_setopt($ch,$k,$v);}
if(is_array($data))$data=http_build_query($data);
if(!empty($data)&&$args['method']!='get'){
curl_setopt($ch,CURLOPT_POST,1);
curl_setopt($ch,CURLOPT_POSTFIELDS,$data);
}        // echo $post.'<br />';
if($string)curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
                      //$this->print_r($url,1);$this->print_r($opts,1);$this->print_r($data,1);$this->print_r($args,1);$this->print_r($string,1);
//resolving SSL problems
if($args['ssl']===false)curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
elseif($args['ssl']===true)curl_setopt($ch, CURLOPT_CAINFO, dirname(__FILE__).'/cacert.pem');
elseif(!empty($args['ssl']))curl_setopt ($ch,$args['ssl']);

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$result = curl_exec($ch); //var_dump($result);    echo curl_errno($ch).' - '.curl_error($ch).'<br />';
$this->curl_error=curl_error($ch);//nx:function curl_error() returns error_number,error_msg
curl_close($ch);
if($string=='json'){if($result)return @json_decode($result,true);else return null;}
else return $result;
}


function wp($url,$path='',$post=[]){  // ex: $x=$dt->wp('http://www.almogtama3.com/','me',['login'=>['user','pass']]);
if(is_array($path))$posts=$path;
elseif(!empty($path)){
if(substr($url,-1)!='/')$url.='/';
if($path=='me')$path='users/me';
$url=$url.'wp-json/wp/v2/'.$path;
}

$args=[];
if(!empty($post['login'][0])){ //BasicAuth plugin must be installed
$args['login']=[$post['login'][0],$post['login'][1],true]; //add login to headers
if(count($post)==1)$args['method']='get';
unset($post['login']);
}
return $this->curl($url,[],$post,$args,'json');
}


function extension($file){return substr($file,strrpos($file,'.')+1);}  //no need to add $this->root because this is a file name or path
function ip2num($x=null){if(!$x)return $_SERVER['REMOTE_ADDR'];elseif(is_number($ip))return long2ip($x);else return ip2long($x);}//else convert ip4 to number , number to ip4
function rand($x=null,$y=1,$keys=false){
    if(is_array($x)){
     //pick one or more item from an array  , it returns the value of the item (not the index) ,to obtain the index of the picked items use php array_rand()
    //if $keys=true the result will be [$key]=>$value , if not the result will be [0]=>$value
    $rand=array_rand($x,$y);
    if($y==1){if($keys)return array($rand,$x[$rand]);return $x[$rand];} //if y=1: pick only one item  else return an array of selected items
    $data=array();
    foreach($rand as $v){
        if($keys)$data[$v]=$x[$v];else $data[]=$x[$v]; //nx: or $data[]=[$k,$v];
    }
    return $data;

    }else return rand($x,$y);
    //nx: problem: if $array=NULL it will return a number , but the expected result is NULL for arrays

}
function root(){
//return the current file path (in the server) & the basic http path (in the browser) , includeng the last "/"
$h=$_SERVER['HTTP_HOST'].'/';
if(!strstr('http',$_SERVER['HTTP_HOST']))$h='http://'.$h;
return array(str_replace('\\','/',getcwd()).'/',$h);
}

/*
function partial($func,...$p){ //generates a partial function application
 return function($func,...$p) use($func,$p) { return call_user_func_array($func,$p);};
}
//error:  Cannot use lexical variable $func as a parameter name ; because $func is used twice php7.1
//workarround: $tmp=$func use($tmp,) https://stackoverflow.com/questions/19431440/why-can-i-not-use-this-as-a-lexical-variable-in-php-5-5-4

*/

function password($pass,$cost=null,$algo=PASSWORD_BCRYPT,$old=''){ //salt is deprecated in php7
    if(is_string($cost))return password_verify($pass,$cost); //$cost : the hash to be checked
    elseif($cost===true)return password_get_info($pass); //$pass: the hash returned by password_hash()
    if(!empty($cost))$cost=['cost'=>$cost];else $cost=[]; //about 60 chars
    if(!empty($old)){ //if the options changed (i.e cost or salt or the alogrithm) so we need to rehash the password again
    if(!password_verify($pass,$old))return false;
    if(!password_needs_rehash($old,$algo,$cost))return $old; //or return true
    }
    return password_hash($pass,$algo,$cost);
}
function password_cost($t=0,$cost=8,$p='test',$algo=PASSWORD_BCRYPT){ //get the best cost for $this->password() that will dosent exeed the target time (it may be difference between server and another) ; $t:the target time in ms ; $cost:the minimum cost to start with
if($t==0)$t=0.1;else $t*=0.01; //the target time in milliseconds ;default=100ms
do {
    $cost++;
    $start=microtime(true);
    password_hash($p,$algo,['cost'=> $cost]);
    $end = microtime(true);
} while (($end - $start) < $t);
return $cost;
}

function cdata($data){return '<![CDATA[ '.$data.' ]]';}

function rss($channel=[],$items=[],$rss=[]){  //rss.link is the feed url , channel[1] is the website url
//nx: $rss.type=atom,...
 if(empty($rss['ver']))$rss['ver']='2.0';
 $x='<?xml version="1.0" encoding="UTF-8" ?>'.(!empty($rss['css'])?'<?xml-stylesheet type="text/css" href="'.$rss['css'].'" ?>':'').'<rss version="'.$rss['ver'].'" xmlns:atom="http://www.w3.org/2005/Atom">'.PHP_EOL;
 $x.='<channel><title>'.$channel[0].'</title><link>'.$channel[1].'</link><description>'.$channel[2].'</description>'.(!empty($rss['link'])?'<atom:link href="'.$rss['link'].'" rel="self" type="application/rss+xml"/>':'').PHP_EOL;

 foreach($items as $item){    //$item['GMT']=+0200
 if(empty($item['guid']))$item['guid']=$item['link'];
 if(!is_array($item['img']))$item['img']=[$item['img']];
 if(empty($item['img'][1]))$item['img'][1]='1024';
 if(empty($item['img'][2]))$item['img'][2]='image/jpeg';
 if(empty($item['GMT']))if(!empty($rss['GMT']))$item['GMT']=$rss['GMT'];else $item['GMT']='GMT';
 $x.='<item><title><![CDATA[ '.$item['title'].' ]]></title><link>'.$item['link'].'</link><guid>'.$item['guid'].'</guid><pubDate>'.date('D, d M Y H:i:s',($item['time'])).' '.$item['GMT'].'</pubDate><description><![CDATA[ '.(!empty($item['img'][0])?'<img src="'.$item['img'][0].'" />':'').'<br />'.$item['description'].'<a href="'.$item['link'].'" target="_blank" '.(!empty($item['rel'])?'rel="'.$item['rel'].'"':'').'>'.$item['link'].'</a>'.' ]]></description>'.(!empty($item['img'][0])?'<enclosure url="'.$item['img'][0].'" length="'.$item['img'][1].'" type="'.$item['img'][2].'" />':'').'</item>'.PHP_EOL;
 }
return $x.'</channel></rss>';
}

function sitemap($data,$tags=true){
     $x='';
     if($tags)$x='<?xml version="1.0" encoding="UTF-8" ?>'.PHP_EOL.'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'.PHP_EOL;
     if(is_array($data)){
       foreach($data as $v){
        if(!is_array($v))$v=[$v,'weekly'];
        $x.='<url><loc>'.$v[0].'</loc><changefreq>'.$v[1].'</changefreq></url>'.PHP_EOL;
     }
     }else $x.=$data;
     if($tags)$x.='</urlset>';

     return $x;
}

function zip(){

}
function download($file,$url=false,$type=false){
$file_name=basename($file);//$file_name=(strstr($file,'/'))?substr($file,strrpos($file,'/')+1):$file;
if(!$type)$type='application/force-download'; //mime_content_type($file)
if(!$url){
header('Content-type: '.$type);
header('Content-Disposition:attachment;filename="'.$file_name.'"');
header('Content-Length:'.filesize($file));
//ob_clean(); flush();
readfile(trim($file));
}else{ //redirect the page after downloading
//nx: this part needs fixing
$b='--'.microtime(true);//boundary
header('Content-Type: multipart/x-mixed-replace; boundary="'.$b.'"');
flush();
echo 'Content-type: '.$type ."\r\n";
echo 'Content-Disposition: attachment; filename='.$file_name."\r\n\r\n";
readfile(trim($file));
echo $b;
flush();
echo 'Content-Type: text/html'."\r\n\r\n";
echo '<meta http-equiv="REFRESH" content="0;url='.$url.'">';
echo $b.'--';
flush();
}}
function memory($unit='b'){
$m=memory_get_usage();
if($unit=='b')return $m;
elseif($unit=='k')return $m/1024;
elseif($unit=='m')return $m/(1024*1024);
elseif($unit=='g')return $m/(1024*1024*1024);
}

function email($to,$subject='',$message='',$attachments=[],$from='',$replyTo='',$charset='UTF-8'){  //$to=[$to,$cc,$Bcc]
if(!is_array($to))$to=[$to];
$to[0]=trim($to[0]);
if(empty($to[0]))return;
if(empty($from))$from=''; //nx
$headers = "From: " . strip_tags($from) . "\r\n";
if(!empty($replyTo))$headers.='Reply-To: '. strip_tags($replyTo) . "\r\n";
if(!empty($to[1]))$headers.='CC: '.$cc."\r\n";

if(!is_array($attachments))$attachments=[$attachments];
if(count($attachments)>0){
$uid = md5(uniqid(time()));
$headers.="MIME-Version: 1.0\r\n";
$headers.='Content-Type: multipart/mixed; boundary="'.$uid."\"\r\n";
$message= '--'.$uid."\r\n"."Content-Type: text/html; charset=$charset\r\n"."Content-Transfer-Encoding: 7bit\r\n\r\n".$message."\r\n\r\n";
foreach($attachments as $file){   //nx: add attachments to messages or headers
$name = basename($file);
$content =@chunk_split(@base64_encode(@file_get_contents($file)));
$message.='--'.$uid."\r\n";
$message.='Content-Type: application/octet-stream; name="'.$name."\"\r\n";
$message.="Content-Transfer-Encoding: base64\r\n";
$message.="Content-Disposition: attachment; filename=\"".$name."\"\r\n\r\n";
$message.=$content."\r\n\r\n";
}
$message.="--".$uid."--";
}else $headers.="Content-Type: text/html; charset=$charset\r\n";


return mail($to[0], $subject, $message, $headers);
}

function html2text($text,$allowable='',$url='',$wrap=0,$nl2br=false){  //source: http://www.chuggnutt.com/html2text
        /*
        $allowable: allowable tags comma separated , $wrap: number of chars per line "text wrap" , 0=no wrap ; $url : the basic url to resolve relative path for links
        nx: use \\1 or \1?
        nx: dynamically change a behaviour of replacement, ex: replace <hr /> with line break
        for test: $txt="xx<h1>hhhh1</h1>yy<h6>hhhh1</h6><i>ii</i>\nzz\taa     q<!--comment--><p>paragraph</p>\nline2 ==================\nline 3===================<br />zz<b>strong</b>";
                  $txt.="<ul><li>item1</li><li>item2</li><li><ul><li>sub_item1</li><li>sub_item2</li></ul></li></ul>";
          */
    if(substr($url,-1) == '/')$url =substr($url, 0, -1); //the relative link may caontain "/" : /file.php
     $text=trim($text);
     if($nl2br)$text=nl2br($text);
     if(empty($text))return '';
       $n=PHP_EOL;$t="\t";
      $tags = array(
        "/\r/"=>'',                                  // Non-legal carriage return
        //"/[\n\t]+/"=>' ',                             // Newlines and tabs
        '/[ ]{2,}/'=>' ',                             // Runs of spaces, pre-handling
        '/<script[^>]*>.*?<\/script>/i'=>'',         // <script>s -- which strip_tags supposedly has problems with
        '/<style[^>]*>.*?<\/style>/i'=>'',           // <style>s -- which strip_tags supposedly has problems with
        '/<!-- .* -->/'=>'',                         // Comments -- which strip_tags might have problem a with
        '/<h[123][^>]*>(.*?)<\/h[123]>/ie'=>'strtoupper($n.$n."\\1".$n)',      // H1 - H3
        '/<h[456][^>]*>(.*?)<\/h[456]>/ie'=>'ucwords($n.$n."\\1".$n)',      // H4 - H6
        '/<p[^>]*>/i'=>$n.$n.$t,                           // <P>
        '/<br[^>]*>/i'=>$n,                          // <br>
        '/<(?:b|strong)[^>]*>(.*?)<\/(?:b|strong)>/ie'=>'strtoupper("\1")',                // <b> , <strong>
        '/(<(?:ul|ol)[^>]*>|<\/(?:ul|ol)>)/i'=>$n,                 // <ul> <ol>
        '/<li[^>]*>(.*?)<\/li>/i'=>$t."* \\1".$n,               // <li> and </li>
        '/<li[^>]*>/i'=>$n.$t,                          // <li> (<li><ul>..</ul></li>)
        '/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/ie'=>'$this->html2text_helper("link","\\1", "\\2",$url)',     // <a href="">
        '/<hr[^>]*>/i'=>$n."--------------------------".$n, // <hr>
        '/(<table[^>]*>|<\/table>)/i'=>$n.$n,           // <table> and </table>
        '/(<tr[^>]*>|<\/tr>)/i'=>$n,                 // <tr> and </tr>
        '/<td[^>]*>(.*?)<\/td>/i'=>$t.$t."\\1".$n,               // <td>
        '/<th[^>]*>(.*?)<\/th>/ie'=>'strtoupper($t.$t."\\1".$n)',              // <th>
        '/&(nbsp|#160);/i'=>' ',                      // Non-breaking space
        '/&(quot|rdquo|ldquo|#8220|#8221|#147|#148);/i'=>'"',  // Double quotes
        '/&(apos|rsquo|lsquo|#8216|#8217);/i'=>"'",   // Single quotes
        '/&gt;/i'=>'>',                               // Greater-than
        '/&lt;/i'=>'<',                               // Less-than
        '/&(amp|#38);/i'=>'&',                        // Ampersand
        '/&(copy|#169);/i'=>'(c)',                      // Copyright
        '/&(trade|#8482|#153);/i'=>'(tm)',               // Trademark
        '/&(reg|#174);/i'=>'(R)',                       // Registered
        '/&(mdash|#151|#8212);/i'=>'--',               // mdash
        '/&(ndash|minus|#8211|#8722);/i'=>'-',        // ndash
        '/&(bull|#149|#8226);/i'=>'*',                // Bullet
        '/&(pound|#163);/i'=>'£',                     // Pound sign
        '/&(euro|#8364);/i'=>'EUR', //(€)                    // Euro sign
        '/&[^&;]+;/i'=>'',                           // Unknown/unhandled entities
        '/[ ]{2,}/'=>' ',                              // Runs of spaces, post-handling

        /*
       '/<[i|em][^>]*>(.*?)<\/[i|em]>/i'=>'_\1_',                 // <i> <em>
        */
    );

      $text = preg_replace(array_keys($tags), array_values($tags), stripslashes($text));  //replace tags
      $text = strip_tags($text,$allowable);//remove any other tags

    //reduce number of empty lines to 2 max
     $text = preg_replace("/\n\s+\n/", PHP_EOL, $text);
     $text = preg_replace("/[\n]{3,}/", PHP_EOL, $text);
     if($wrap>0)$text=wordwrap($text,$wrap);
     return $text;
}

function html2text_helper($do,...$p){
   if($do=='link'){
         $link=$p[0]; $text=$p[1]; $basic=$p[2];
         if(substr($link, 0, 11) == 'javascript:')return '';
         if($text==$link||strstr(substr($text, 0, 11),'://'))$text='';
         elseif(!strstr(substr($link, 0, 11),'://')){
             if ( substr($link, 0, 1) != '/' )$link='/'.$link;
             $link=$basic.$link;
         }

         return $text.' ('.$link.') ';
   }
}

function hyper($data,$opt=[]){
  //convert text links to hyper links ; from wp:auto-hyperlink-urls
 //use another functions to modify links: $dt->links();

 //for test: $txt='without scheme: test.com , test.com.eg <br />with scheme: http://google.com , http://google.com.eg<br /> email:  hello@gmail.com hello@gmail.com.eg';
     $arr = preg_split( '/(<[^<>]+>)/', $data, -1, PREG_SPLIT_DELIM_CAPTURE ); //split out HTML tags
     $nested = 0; // how many levels link is nested inside <pre>,<code>,<style>,<script>
     $r='';
     if(empty($opt['ext']))$opt['ext']='com|org|net|gov|edu|mil|us|info|biz|ws|name|mobi|cc|tv|me'; //you can use * for any extention
     else $opt['ext']=str_replace(',', '|', $opt['ext']);
     $opt['ext']='(?:'.$opt['ext'].')(?:\..{2})?'; //nx: .com.eg

     foreach ( $arr as $v ) {
       if (preg_match( '#^<(?:code|pre|script|style)[\s>]#i', $v ))$nested++;
       elseif ( $nested && in_array(strtolower($v),['</code>','</pre>','</script>','</style>']))$nested--;

       if ( $nested || empty($v) || ($v[0] === '<' && ! preg_match( '|^<\s*[\w]{1,20}+://|', $v))){$r.=$v;continue;}

        $v=" $v "; //Temporarily introduce a leading and trailing single space to the text to simplify regex handling.

        //1-links that don't have a URI scheme.
        $v = preg_replace_callback(
        '#(?!<.*?)([\s{}\(\)\[\]>,\'\";:])([a-z0-9]+[a-z0-9\-\.]*)\.('.$opt['ext'].')((?:[/\#?][^\s<{}\(\)\[\]]*[^\.,\s<{}\(\)\[\]]?)?)(?![^<>]*?>)#is',
        /*'#(?!<.*?)                #negative lookahead: (!<...) not inside html attribute i.e <a...$link
        ([\s{}\(\)\[\]>,\'\";:])  #spaces & marks
        ([a-z0-9]+[a-z0-9\-\.]*)  #starts with letters&numbers then -,.,letters&numbers i.e: test-example.com or test.example.com
        \.('.$opt['ext'].')       #.com ;nx: .com[.*]{2}?
        ((?:[/\#?][^\s<{}\(\)\[\]]*[^\.,\s<{}\(\)\[\]]?)?)
        (?![^<>]*?>)#is', */        #negative lookahead: (!...>)
        function($m){
          //$this->print_r($m);
            $link=$m[2] . '.' . $m[3] . $m[4];
            return $m[1].'<a href="http://'.$link.'">'.$link.'</a>';
        },$v);

        //2-links that have an explicit URI scheme. ;nx: review regex and function($m)
        $regex =  '~
          (?!<.*?)                                           # Non-capturing check to ensure not matching what looks like the inside of an HTML tag.
          (?<=[\s>.,:;!?])                                   # 1: Leading whitespace or character.
          (\(?)                                              # Maybe an open parenthesis?
          (                                                  # 2: Full URL
            ([\w]{1,20}?://)                                 # 3: Scheme and hier-part prefix
            (                                                # 4: URL minus URI scheme
              (?=\S{1,2000}\s)                               # Limit to URLs less than about 2000 characters long
              [\\w\\x80-\\xff#%\\~/@\\[\\]*(+=&$-]*+         # Non-punctuation URL character
              (?:                                            # Unroll the Loop: Only allow puctuation URL character if followed by a non-punctuation URL character
                [\'.,;:!?)]                                  # Punctuation URL character
                [\\w\\x80-\\xff#%\\~/@\\[\\]*(+=&$-]++       # Non-punctuation URL character
              )*
            )
          )
          (\)?)                                              # 5: Trailing closing parenthesis (for parethesis balancing post processing)
          (?![^<>]*?>) # Check to ensure not within what looks like an HTML tag.
          ~ixS';

          $v = preg_replace_callback($regex,function($m){ //$this->print_r($m);
             $link=$m[2];

             // If the trailing character is a closing parethesis, and the URL has an opening parenthesis in it, add the closing parenthesis to the URL.
             // Then we can let the parenthesis balancer do its thing below.
             if ( ')' == $m[5] && strpos( $link, '(' ) ) {$link .= $m[5];$suffix = '';}
             else $suffix = $m[5];

             // Include parentheses in the URL only if paired.
             while ( substr_count( $link, '(' ) < substr_count( $link, ')' ) ) {
               $suffix = strrchr( $link, ')' ) . $suffix;
               $link = substr( $link, 0, strrpos( $link, ')' ) );
             }

             //$link = esc_url( $link ); //https://codex.wordpress.org/Function_Reference/esc_url

             return $m[1]. '<a href="' . $link . '">'.$link. '</a>'. $suffix;

          },$v);

         if($opt['email']!==false){
           //3- convert email adresses
           $v = preg_replace_callback( //nx:review regex
           '#(?!<.*?)([.0-9a-z_+-]+)@(([0-9a-z-]+\.)+[0-9a-z]{2,})(?![^<>]*?>)#i',function($m){
              $email = $m[1] . '@' . $m[2];
              return '<a href="mailto:' . $email . '">'.$email. '</a>';
           },$v);
         }
        $r.=$v;

     }
     //remove nested links, ex: <a>http://test.com</a> will be converted to <a><a href=test.com></a></a>
    return preg_replace( "#(<a\s+[^>]+>)(.*)<a\s+[^>]+>([^<]*)</a>([^>]*)</a>#iU", "$1$2$3$4</a>" , $r ); //or $a=$dom->get('a'); if($a->textContent type=="a")$a->texrContent=$aa->href
    }

    function ip($deep=true){
      if($deep){
        if(!empty($_SERVER['HTTP_CLIENT_IP']))$ip = $_SERVER['HTTP_CLIENT_IP'];
        else if(!empty($_SERVER['HTTP_X_FORWARDED_FOR']))$ip = $_SERVER['HTTP_X_FORWARDED_FOR']; //nx: check cloudflare doc. for this header
        else if(!empty($_SERVER['HTTP_X_FORWARDED']))$ip = $_SERVER['HTTP_X_FORWARDED'];
        else if(!empty($_SERVER['HTTP_FORWARDED_FOR'])) $ip = $_SERVER['HTTP_FORWARDED_FOR'];
        else if(!empty($_SERVER['HTTP_FORWARDED']))$ip = $_SERVER['HTTP_FORWARDED'];
        else if(!empty($_SERVER['REMOTE_ADDR']))$ip = $_SERVER['REMOTE_ADDR'];
        else $ip = NULL;
      }else $ip = $_SERVER["REMOTE_ADDR"];
      return $ip;
    }

    function geo($ip=null){ //get country code using geoplugin.com (GEO & currency converting) and maxmind.com (visitor info) ;nx:  http://php.net/manual/en/book.geoip.php
     $data=@json_decode(file_get_contents('http://www.geoplugin.net/json.gp?ip='.$ip),true);
     return ['country'=>$data['geoplugin_countryCode'],'city'=>$data['geoplugin_city'],'region'=>$data['geoplugin_regionName'],'continent'=>$data['geoplugin_continentName'],'map'=>[$data['geoplugin_latitude'],$data['geoplugin_longitude']],'timezone'=>$data['geoplugin_timezone'],'currency'=>[$data['geoplugin_currencyCode'],$data['geoplugin_currencySymbol_UTF8'],$data['geoplugin_currencyConverter']] ];
    }

  function countries($type=null,$lang='en'){ //nx: move to geo->countries(),cities(),...
  if($lang=='ar')$countries = [
    'SA' =>'السعودية',
    'ET' =>'اثيوبيا',
    'AZ' =>'اذربيجان',
    'AM' =>'ارمينيا',
    'AW' =>'اروبا',
    'ER' =>'اريتريا',
    'ES' =>'اسبانيا',
    'AU' =>'استراليا',
    'EE' =>'استونيا',
    'IL' =>'اسرائيل',
    'AF' =>'افغانستان',
    'EC' =>'الاكوادور',
    'AR' =>'الارجنتين',
    'JO' =>'الاردن',
    'AE' =>'الامارات',
    'AL' =>'البانيا',
    'BR' =>'البرازيل',
    'PT' =>'البرتغال',
    'BA' =>'البوسنة والهرسك',
    'GA' =>'الجابون',
    'DZ' =>'الجزائر',
    'DK' =>'الدانمارك',
    'CV' =>'الراس الاخضر',
    'PS' =>'فلسطين',
    'SV' =>'السلفادور',
    'SN' =>'السنغال',
    'SD' =>'السودان',
    'SE' =>'السويد',
    'SO' =>'الصومال',
    'CN' =>'الصين',
    'IQ' =>'العراق',
    'PH' =>'الفلبين',
    'CM' =>'الكاميرون',
    'CG' =>'الكونغو',
    'CD' =>'الكونغو ',
    'KW' =>'الكويت',
    'DE' =>'المانيا',
    'HU' =>'المجر',
    'MA' =>'المغرب',
    'MX' =>'المكسيك',
    'UK' =>'انجلترا',
    'TF' =>'انتراكتيكا',
    'NO' =>'النرويج',
    'AT' =>'النمسا',
    'NE' =>'النيجر',
    'IN' =>'الهند',
    'US' =>'الولايات المتحدة',
    'JP' =>'اليابان',
    'YE' =>'اليمن',
    'GR' =>'اليونان',
    'AQ' =>'انتاركتيكا',
    'AG' =>'انتيغوا وبربودا',
    'AD' =>'اندورا',
    'ID' =>'اندونيسيا',
    'AO' =>'انغولا',
    'AI' =>'انغويلا',
    'UY' =>'اوروجواي',
    'UZ' =>'اوزبكستان',
    'UG' =>'اوغندا',
    'UA' =>'اوكرانيا',
    'IR' =>'ايران',
    'IE' =>'ايرلندا',
    'IS' =>'ايسلندا',
    'IT' =>'ايطاليا',
    'PG' =>'بابوا-غينيا الجديدة',
    'PY' =>'باراجواي',
    'BB' =>'باربادوس',
    'PK' =>'باكستان',
    'PW' =>'بالاو',
    'BM' =>'برمودا',
    'BN' =>'بروناي',
    'BE' =>'بلجيكا',
    'BG' =>'بلغاريا',
    'BD' =>'بنجلاديش',
    'PA' =>'بنما',
    'BJ' =>'بنين',
    'BT' =>'بوتان',
    'BW' =>'بوتسوانا',
    'PR' =>'بورتو ريكو',
    'BF' =>'بوركينا فاسو',
    'BI' =>'بوروندي',
    'PL' =>'بولندا',
    'BO' =>'بوليفيا',
    'PF' =>'بولينزيا الفرنسية',
    'PE' =>'بيرو',
    'BY' =>'بيلاروس',
    'BZ' =>'بيليز',
    'TH' =>'تايلاند',
    'TW' =>'تايوان',
    'TM' =>'تركمانستان',
    'TR' =>'تركيا',
    'TT' =>'ترينيداد وتوباجو',
    'TD' =>'تشاد',
    'CL' =>'تشيلي',
    'TZ' =>'تنزانيا',
    'TG' =>'توجو',
    'TV' =>'توفالو',
    'TK' =>'توكيلاو',
    'TO' =>'تونجا',
    'TN' =>'تونس',
    'TP' =>'تيمور الشرقية',
    'JM' =>'جامايكا',
    'GM' =>'جامبيا',
    'GI' =>'جبل طارق',
    'GL' =>'جرينلاند',
    'AN' =>'جزر الانتيل الهولندية',
    'PN' =>'جزر البتكارين',
    'BS' =>'جزر البهاما',
    'VG' =>'جزر العذراء البريطانية',
    'VI' =>'جزر العذراء، الولايات المتحدة',
    'KM' =>'جزر القمر',
    'CC' =>'جزر الكوكوس (كيلين)',
    'MV' =>'جزر المالديف',
    'TC' =>'جزر تركس وكايكوس',
    'AS' =>'جزر ساموا الامريكية',
    'SB' =>'جزر سولومون',
    'FO' =>'جزر فايرو',
    'UM' =>'جزر فرعية تابعة للولايات المتحدة',
    'FK' =>'جزر فوكلاند (ايزلاس مالفيناس)',
    'FJ' =>'جزر فيجي',
    'KY' =>'جزر كايمان',
    'CK' =>'جزر كوك',
    'MH' =>'جزر مارشال',
    'MP' =>'جزر ماريانا الشمالية',
    'CX' =>'جزيرة الكريسماس',
    'BV' =>'جزيرة بوفيه',
    'IM' =>'جزيرة مان',
    'NF' =>'جزيرة نورفوك',
    'HM' =>'جزيرة هيرد وجزر ماكدونالد',
    'CF' =>'جمهورية افريقيا الوسطى',
    'CZ' =>'التشيك',
    'DO' =>'الدومينيكان',
    'ZA' =>'جنوب افريقيا',
    'GT' =>'جواتيمالا',
    'GP' =>'جواديلوب',
    'GU' =>'جوام',
    'GE' =>'جورجيا',
    'GS' =>'جورجيا الجنوبية',
    'GY' =>'جيانا',
    'GF' =>'جيانا الفرنسية',
    'DJ' =>'جيبوتي',
    'JE' =>'جيرسي',
    'GG' =>'جيرنزي',
    'VA' =>'دولة الفاتيكان',
    'DM' =>'دومينيكا',
    'RW' =>'رواندا',
    'RU' =>'روسيا',
    'RO' =>'رومانيا',
    'RE' =>'ريونيون',
    'ZM' =>'زامبيا',
    'ZW' =>'زيمبابوي',
    'WS' =>'ساموا',
    'SM' =>'سان مارينو',
    'PM' =>'سانت بيير وميكولون',
    'VC' =>'سانت فينسنت وجرينادينز',
    'KN' =>'سانت كيتس ونيفيس',
    'LC' =>'سانت لوشيا',
    'SH' =>'سانت هيلينا',
    'ST' =>'ساوتوماي وبرينسيبا',
    'SJ' =>'سفالبارد وجان ماين',
    'SK' =>'سلوفاكيا',
    'SI' =>'سلوفينيا',
    'SG' =>'سنغافورة',
    'SZ' =>'سوازيلاند',
    'SY' =>'سوريا',
    'SR' =>'سورينام',
    'CH' =>'سويسرا',
    'SL' =>'سيراليون',
    'LK' =>'سيريلانكا',
    'SC' =>'سيشل',
    'RS' =>'صربيا',
    'TJ' =>'طاجيكستان',
    'OM' =>'عمان',
    'GH' =>'غانا',
    'GD' =>'غرينادا',
    'GN' =>'غينيا',
    'GQ' =>'غينيا الاستوائية',
    'GW' =>'غينيا بيساو',
    'VU' =>'فانواتو',
    'FR' =>'فرنسا',
    'VE' =>'فنزويلا',
    'FI' =>'فنلندا',
    'VN' =>'فيتنام',
    'CY' =>'قبرص',
    'QA' =>'قطر',
    'KG' =>'قيرقيزستان',
    'KZ' =>'كازاخستان',
    'NC' =>'كاليدونيا الجديدة',
    'KH' =>'كامبوديا',
    'HR' =>'كرواتيا',
    'CA' =>'كندا',
    'CU' =>'كوبا',
    'CI' =>'كوت ديفوار (ساحل العاج)',
    'KR' =>'كوريا',
    'KP' =>'كوريا الشمالية',
    'CR' =>'كوستاريكا',
    'CO' =>'كولومبيا',
    'KI' =>'كيريباتي',
    'KE' =>'كينيا',
    'LV' =>'لاتفيا',
    'LA' =>'لاوس',
    'LB' =>'لبنان',
    'LI' =>'لختنشتاين',
    'LU' =>'لوكسمبورج',
    'LY' =>'ليبيا',
    'LR' =>'ليبيريا',
    'LT' =>'ليتوانيا',
    'LS' =>'ليسوتو',
    'MQ' =>'مارتينيك',
    'MO' =>'ماكاو',
    'FM' =>'ماكرونيزيا',
    'MW' =>'مالاوي',
    'MT' =>'مالطا',
    'ML' =>'مالي',
    'MY' =>'ماليزيا',
    'YT' =>'مايوت',
    'MG' =>'مدغشقر',
    'EG' =>'مصر',
    'MK' =>'مقدونيا (يوغوسلافيا)',
    'BH' =>'البحرين',
    'MN' =>'منغوليا',
    'MR' =>'موريتانيا',
    'MU' =>'موريشيوس',
    'MZ' =>'موزمبيق',
    'MD' =>'مولدوفا',
    'MC' =>'موناكو',
    'MS' =>'مونتسيرات',
    'ME' =>'مونتينيغرو',
    'MM' =>'ميانمار',
    'NA' =>'ناميبيا',
    'NR' =>'ناورو',
    'NP' =>'نيبال',
    'NG' =>'نيجيريا',
    'NI' =>'نيكاراجوا',
    'NU' =>'نيوا',
    'NZ' =>'نيوزيلندا',
    'HT' =>'هايتي',
    'HN' =>'هندوراس',
    'NL' =>'هولندا',
    'HK' =>'هونغ كونغ',
    'WF' =>'واليس وفوتونا'
];

  else $countries=[''=>'','EG'=>'Egypt','AF'=>'Afghanistan','AL'=>'Albania','DZ'=>'Algeria','AO'=>'Angola','AR'=>'Argentina','AM'=>'Armenia','AU'=>'Australia','BH'=>'Bahrain','BD'=>'Bangladesh','BE'=>'Belgium','BA'=>'Bosnia , Herzegovina','BR'=>'Brazil','BG'=>'Bulgaria','BI'=>'Burundi','CM'=>'Cameroon','CA'=>'Canada','TD'=>'Chad','CL'=>'Chile','CN'=>'China','CO'=>'Columbia','KM'=>'Comoros','CG'=>'Congo','CR'=>'Costa Rica','CI'=>'Cote D Ivorie','CU'=>'Cuba','CY'=>'Cyprus','CZ'=>'Czech','DK'=>'Denmark','DJ'=>'Djibouti','EC'=>'Ecuador','SV'=>'El Salvador','GQ'=>'Equatorial-Guinea','ER'=>'Eritrea','ET'=>'Ethiopia','FI'=>'Finland','FR'=>'France','GA'=>'Gabon','GM'=>'Gambia','GE'=>'Georgia','DE'=>'Germany','GH'=>'Ghana','GI'=>'Gibraltar','GR'=>'Greece','GT'=>'Guatemala','GN'=>'Guinea','GW'=>'Guinea-Bissau','GY'=>'Guyana','HT'=>'Haiti','HM'=>'Heard , McDonald','HN'=>'Honduras','HK'=>'Hong Kong','HU'=>'Hungary','IS'=>'Iceland','IN'=>'India','ID'=>'Indonesia','IR'=>'Iran','IQ'=>'Iraq','IE'=>'Ireland','IL'=>'Israel','IT'=>'Italy','JM'=>'Jamaica','JP'=>'Japan','JO'=>'Jordan','KZ'=>'Kazakhstan','KE'=>'Kenya','KI'=>'Kiribati','KW'=>'Kuwait','KG'=>'Kyrgyzstan','LA'=>'Laos','LV'=>'Latvia','LB'=>'Lebanon','LS'=>'Lesotho','LR'=>'Liberia','LY'=>'Libya','LI'=>'Liechtenstein','LT'=>'Lithuania','LU'=>'Luxembourg','MO'=>'Macau','MK'=>'Macedonia','MG'=>'Madagascar','MW'=>'Malawi','MY'=>'Malaysia','MV'=>'Maldives','ML'=>'Mali','MT'=>'Malta','MH'=>'Marshall','MQ'=>'Martinique','MR'=>'Mauritania','MU'=>'Mauritius','YT'=>'Mayotte','MX'=>'Mexico','FM'=>'Micronesia','MD'=>'Moldova','MC'=>'Monaco','MN'=>'Mongolia','MS'=>'Montserrat','MA'=>'Morocco','MZ'=>'Mozambique','MM'=>'Myanmar (Burma)','NA'=>'Namibia','NR'=>'Nauru','NP'=>'Nepal','NL'=>'Netherlands','AN'=>'Netherlands Antilles','NC'=>'New Caledonia','NZ'=>'New Zealand','NI'=>'Nicaragua','NE'=>'Niger','NG'=>'Nigeria','NU'=>'Niue','NF'=>'Norfolk','KP'=>'North Korea','MP'=>'Northern Mariana','NO'=>'Norway','OM'=>'Oman','PK'=>'Pakistan','PW'=>'Palau','PA'=>'Panama','PG'=>'Papua New-Guinea','PY'=>'Paraguay','PE'=>'Peru','PH'=>'Philippines','PN'=>'Pitcairn','PL'=>'Poland','PT'=>'Portugal','PR'=>'Puerto Rico','QA'=>'Qatar','RE'=>'Reunion','RO'=>'Romania','RU'=>'Russia','RW'=>'Rwanda','SH'=>'Saint-Helena','KN'=>'Saint-Kitts , Nevis','LC'=>'Saint-Lucia','PM'=>'Saint-Pierre , Miquelon','VC'=>'Saint-Vincent , The Grenadines','SM'=>'San Marino','ST'=>'Sao Tome , Principe','SA'=>'Saudi Arabia','SN'=>'Senegal','SC'=>'Seychelles','SL'=>'Sierra Leone','SG'=>'Singapore','SK'=>'Slovak','SI'=>'Slovenia','SB'=>'Solomon','SO'=>'Somalia','ZA'=>'South-Africa','GS'=>'South-Georgia , South-Sandwich ','KR'=>'South-Korea','ES'=>'Spain','LK'=>'Sri Lanka','SD'=>'Sudan','SR'=>'Suriname','SJ'=>'Svalbard , Jan Mayen','SZ'=>'Swaziland','SE'=>'Sweden','CH'=>'Switzerland','SY'=>'Syria','TW'=>'Taiwan','TJ'=>'Tajikistan','TZ'=>'Tanzania','TH'=>'Thailand','TG'=>'Togo','TK'=>'Tokelau','TO'=>'Tonga','TT'=>'Trinidad , Tobago','TN'=>'Tunisia','TR'=>'Turkey','TM'=>'Turkmenistan','TC'=>'Turks , Caicos','TV'=>'Tuvalu','UG'=>'Uganda','UA'=>'Ukraine','AE'=>'United-Arab Emirates','UK'=>'United-Kingdom','US'=>'United-States','UM'=>'United-States Minor Outlying','UY'=>'Uruguay','UZ'=>'Uzbekistan','VU'=>'Vanuatu','VA'=>'Vatican City (Holy See)','VE'=>'Venezuela','VN'=>'Vietnam','VG'=>'Virgin (British)','VI'=>'Virgin (US)','WF'=>'Wallis , Futuna','EH'=>'Western Sahara','WS'=>'Western Samoa','YE'=>'Yemen','YU'=>'Yugoslavia','ZM'=>'Zambia','ZW'=>'Zimbabwe'];

  if(!empty($type)){ //arab,europ,asia,middle east,..
    //filter $countries array
    if($type=='arab')$co=['EG','SA']; //nx:
      $data=[];
      foreach($co as $v)$data[$v]=$countries[$v];
      $countries=$data;
    }
  return $countries;
}
//---------------------------------Done converted to Node.js ---------------------------------//

public $root=''; //including '/'
function cache($file,$data,$expire=null,$type=null,$empty=true){   //$expire in hours ,if =null don't update cache just create it , if<0 force update ; $empty : save the empty valuse as a cache file
$n=time(); $file=$this->root.$file;
if(!file_exists($file)||(is_numeric($expire)&&$expire<0)||($expire&&floor(@filemtime($file))<$n-$expire*60*60)){
  if(is_callable($data))$data=$data(); //$func() may be a string or array or a callable function
     if(is_array($data)){
         $string=@json_encode($data);
         @file_put_contents($file,$string);
         if(!$type||$type=='array')return $data;elseif($type=='string')return $string;
     }else{
         if(!empty($data)||$empty)@file_put_contents($file,$data);
         if(!$type||$type=='string')return $data;elseif($type=='array')return []; //or null
     }

 }else{ //cache ok
   $data=@file_get_contents($file);
   $n=@filemtime($file);
   if(!$type||$type=='string')return $data;elseif($type=='array')return @json_decode($data,true);

 }
if($type=='time')return $n; //[$n,$data];
}

function mkdir($path='',$p=0777,$data='<meta http-equiv="REFRESH" content="0;url=/">'){
 if(is_array($path)){$r=[];foreach($path as $v)$r[$v]=self::mkdir($v,$p,$data);return $r;}
 $path=$this->root.$path;
 if(is_dir($path))return true;
    @mkdir($path,$p);
    return @file_put_contents($path.'/index.htm',$data);
}

}
return new data();
?>
