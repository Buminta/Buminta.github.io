var docs = 
{

	"/github/2014/09/06/welcome.html":{
	"id"    : "/github/2014/09/06/welcome.html",
	"title"   : "Welcome",
	"content" : "Hi everybody, I’m welcome you to views github pages of me.I’m developer all platform and i’m always trying, trying learn to the good developer.Here, I’m shares somethings I know and some projects make by me.Thanks for viewers.def begining  puts &#39;welcome everybody&#39;end"
},

	"/developer/2014/09/06/nguyen-tac-co-ban-trong-xay-dung-he-thong-server.html":{
	"id"    : "/developer/2014/09/06/nguyen-tac-co-ban-trong-xay-dung-he-thong-server.html",
	"title"   : "Nguyên tắc quan trọng trong xây dựng hệ thống (server)",
	"content" : "  Ghi log chi tiết tất cả mọi thứ, mọi lúc. Dữ liệu log trong database tránh tham chiếu đến các bảng db khác mà lưu giá trị cụ thể, ví dụ: log product thì ngoài product id phải lưu cả product_price, product_title… để tránh các giá trị thay đổi theo thời gian bởi người dùng  Xây dựng hệ thống error trace chi tiết và rõ ràng phục vụ cho debug và dễ dàng xóa bỏ khi deploy  Quản lý danh sách các tài khoản test, sandbox để dễ dàng và chính xác trong việc thống kê và remove khi deploy chính thức  Cung cấp hệ thống bảo mật, xác thực ngay từ đầu 1 cách tổng quát cho chức năng, tài khoản truy cập, token cho bên thứ 3 để quản lý việc ai được sử dụng chức năng…, ghi log truy cập của người dùng… Ví dụ cp muốn sử dụng api thì phải đăng ký api_key dành riêng cho mỗi cp, giúp cho việc log và quản lý dễ dàng, bảo mật…  Luôn luôn backup dữ liệu:          source qua svn bằng cách tạo quy trình deployment với branchs, tags…    Ví dụ: khi deploy product thì cần:   . tạo 1 bản tag theo version kèm ngày tương ứng 1.0.20140109, 2.3.20140103…    . sau đó export ra thư mục deployment   khi cần sửa 1 chức năng nhỏ trong bản release 1.0.20130518 mà source đang phát triển cho 2.0 rồi thì cần:   . tạo 1 bản branch từ bản tag 1.0.20130518 với tên là “version_mục_đích_thay_đổi”   . sau đó sửa trên bản branch đến khi hoàn thiện   . cập nhật sang source trunk   . tạo tag với version cũ và ngày release vd: 1.0.20130624   . backup thư mục source deployment vào 1 thư mục backup với tên thư mục là ngày tháng năm backup như 20140901   . export đè vào thư mục source deployment      databases backup tự động định kỳ hàng ngày/tuần/tháng      backup databases manual mỗi lần nâng cấp hệ thống, test hệ thống        Luôn sao database chính ra 1 db tạm khi thử chức năng mới mà có kết nối đến db kể cả có chỉnh sửa db hay ko  Tạo thư mục source, database, tk riêng cho mỗi developer trong quá trình dev, ko dùng chung với db và deployed source  Lưu tất cả tài khoản liên quan đến hệ thống như tk server, database, svn, quản trị… xuống note, server hoặc lưu trữ vào bất kỳ nơi nào an toàn, đảm bảo và cập nhật ngay khi có sự thay đổi  Nghiêm chỉnh chấp hành các quy trình bảo mật và an toàn dữ liệu trên dù chỉ thay đổi nhỏ hoặc đơn giản"
},

	"/language/2014/09/06/ngon-ngu-lap-trinh-nao-tot-nhat.html":{
	"id"    : "/language/2014/09/06/ngon-ngu-lap-trinh-nao-tot-nhat.html",
	"title"   : "Ngôn ngữ lập trình nào tốt nhất?",
	"content" : "Xin chào các bạn, nếu các bạn đến với bài viết vì vì cái câu hỏi vu vơ kia và cũng chỉ để xem ngôn ngữ lập trình nào là tốt nhất, để rồi đắc ý khoe khoang thứ ngôn ngữ mình đang theo là đỉnh cao nhất, là anh cả của các ông dung ngôn ngữ khác, thì thực sự xin lỗi bạn sẽ không tìm được thứ như mình mong muốn đâu.Vậy, ngôn ngữ lập trình nào tốt nhất, mình xin mạo muội nói rằng các bạn không thể đem so sánh ngôn ngữ nào hơn ngôn ngữ nào, vì đơn giản mỗi ngôn ngữ lập trình đều có điểm mạnh điểm yếu riêng, cũng như nó thích hợp với từng nền tảng khác nhau, chả ai đem Passcal đi để lập trình web cả, cũng chả ai đem PHP để viết mấy cái chương trình console tính toán cơ bản đâu.Vậy tại sao vẫn phân các ngôn ngữ lập trình làm chi, sao không làm 1 cho tất cả: thực ra thì mình nghĩ điều này ai chả muốn, nhưng mọi người hãy xem rằng khi lập trình mới nhen nhóm phát triển thì có hàng trăm nghìn tổ chức cùng phát triển, nó sẽ rẽ nhiều nhánh khác nhau, và tất nhiên nó sẽ không thể hợp nhất được. điều các bạn cần là hãy làm đi, và cần những gì để đủ làm với nó, đó chính là kiến thức về hướng đối tượng, kĩ năng thao tác với hệ cơ sở dữ liệu và các thuật toán tối ưu siêu dị của chính bạn là chìa khóa để trở thành những người Dev tốt nhất…Và điều quan trọng để bạn tiếp cận các ngôn ngữ đó là hiểu nó là gì, thông dịch, biên dịch hay có hướng đối tượng hay không? Để có thể lựa chọn phù hợp nhất cho sản phẩm sắp phát triển của bạn. Vậy tiếp theo mình sẽ nói sơ qua về các khái niệm phân biệt ngôn ngữ lập trình kia cho những bạn nào đang quan tâm:Thông dịch hay biên dịch:      Thông dịch là gì? Thông dịch hay còn có thể gọi là ngôn ngữ hướng dòng, Nghĩa là khi chương trình của bạn chạy, thì sẽ chẳng cần qua khâu biên dịch mà chạy được ngay, đến dòng nào nó làm công việc đó, và đến dòng lỗi chương trình sẽ đứng lại không đi tiếp (Chúng ta ko đề cập tới sử dụng khái niệm ‘ngoại lệ’ ở đây nhé), thông dịch phổ biến ở các ngôn ngữ lập trình web như PHP, Python hay ở Ngôn ngữ máy huyền thoại Assembly mà ko phải ai cũng dám sờ vào nó/ Với những loại này thì hiệu quả chương trình với hiệu năng thời gian nhanh hơn hẳn, vì chẳng mất thời gian để build chương trình cũng như code đến đâu test luôn đến đó. Cơ chế bảo mật ko thể cao hơn biên dịch, dễ dàng bỏ sót các lỗi Sytax Error trong lập trình.        Biên dịch là gì? Biên dịch lại đi ngược với thông dịch, trước khi chương trình được chạy thì nó cần được biên dịch thành 1 tệp tin chương trình trước, và quá trình này sẽ rà soát các lỗi Sytax Error để ko cho phép chương trình được biên dịch nếu còn lỗi cú pháp. Và tất nhiên thời gian cho các chương trình này sẽ cần thời gian biên dịch chương trình trước, cũng như cần khai báo 1 hàm main để chương trình chạy nó trước (Không giống với thông dịch, chạy file nào thì thực hiện lệnh ở đó, không cần khai báo hàm main). Và tất nhiên biên dịch sẽ không thể gặp lỗi cú pháp khi chương trình chạy cũng như bảo mật tốt hơn. Những ngôn ngữ biên dịch phổ biến như: C++, C#, Java.  Vậy còn hướng đối tượng hay hướng cấu trúc:       Hầu hết các ngôn ngữ hiện nay đều là hướng đối tượng trừ C thì vẫn hướng cấu trúc, và hiểu nôm na hướng đối tượng giống như một kiểu mở rộng của hướng cấu trúc.        Hướng cấu trúc là các khối lệnh được sử dụng nhiều lần sẽ được nhóm lại thành một hàm xử lý riêng biệt và được dùng lại mỗi khi cần, cũng như các câu lệnh sẽ được thực thi theo trình tự hay lặp đi lặp lại nhiều lần.        Còn hướng đối tượng thì được mở rộng hơn với các Lớp, đối tượng và Khái niệm đóng gói, Hay có thể là Blocking hay Non-Blocking, Và đây chính là giải pháp để chúng ta có thể phát triển các ứng dụng với sự phân cấp các chức năng sâu hơn, rõ ràng hơn hay thể hiện gần sát nhất với chức năng của từng đối tượng cũng như thể hiện sự liên quan của các đối tượng tới nhau như kế thừa, kết tập và có thể tạo nhiều đối tượng có các hành động gần giống nhau mà lại mang các thuộc tính khác nhau…  Trên đây là ý kiến chủ quan của mình về những khái niệm căn bản trong lập trình, mong rằng giúp ích cho các bạn, hẹn gặp lại các bạn trong bài viết tiếp theo.K.T Buminta."
},

	"/nodejs/2014/09/06/framework-mvc-for-build-web-applicaion-by-nodejs.html":{
	"id"    : "/nodejs/2014/09/06/framework-mvc-for-build-web-applicaion-by-nodejs.html",
	"title"   : "Framework MVC for build web application by NodeJS",
	"content" : "Beta version from gitMVC Framework for build web application//configs.jsmodule.exports = {	listen_port: 3000,	database: {		host: &quot;127.0.0.1&quot;,		port: 27017,		name: &quot;demo&quot;	},	sercurity: {		key: &quot;express.sid&quot;,		secret: &quot;1234567890QWERTY&quot;	},	// socket_path: samples.js	// adding when using socket.io	// var global for using: socket, session}Using socket when u needPackage using from fw//package.json{  &quot;name&quot;: &quot;WNodeJS&quot;,  &quot;description&quot;: &quot;MVC Framework for ExpressJS&quot;,  &quot;version&quot;: &quot;1.0.0&quot;,  &quot;author&quot;: &quot;Tan Bui (http://buminta.com)&quot;,  &quot;repository&quot; : {    &quot;type&quot; : &quot;git&quot;,    &quot;url&quot; : &quot;https://github.com/buminta/wnode.git&quot;  },  &quot;dependencies&quot;: {    &quot;express&quot;: &quot;3.x&quot;,    &quot;MD5&quot;: &quot;latest&quot;,    &quot;socket.io&quot;: &quot;latest&quot;,    &quot;jade&quot;: &quot;latest&quot;,    &quot;connect&quot;: &quot;latest&quot;,    &quot;mongodb&quot;: &quot;latest&quot;  },  &quot;engines&quot;: {    &quot;node&quot;: &quot;0.10.x&quot;,    &quot;npm&quot;: &quot;1.4.x&quot;  }}  public folder for using somes file using in client  views folder for jade language of template application  models folder for class in out with database  controllers folder for class control request and responsive// controllers/demo.js// Extend from controller Class in libs.module.exports = Controller.extend({	run: function(){		//the first run before action runing	},	index: function(){		//action for controller	}});"
},

	"/nodejs/2014/09/06/chat-realtime-wnodejs.html":{
	"id"    : "/nodejs/2014/09/06/chat-realtime-wnodejs.html",
	"title"   : "Chat Realtime WNodeJS",
	"content" : "Beta version from gitNode listening with port 3000  Chat Real time with NodeJS, Socket.IO, ExpressJS, Jade Template  Create room chat and join to any room  Using demo MVC lite, with Express JSListening MongoDBvar server = new Server(&#39;127.0.0.1&#39;, 27017, {auto_reconnect: true});var db = new Db(&#39;chatnode&#39;, server, {safe:false});Restore database MongoDB for demofrom &quot;./database/chatnode&quot;  user/password: admin/123456"
},

};
// init lunr
var idx = lunr(function () {
	this.field('title', {boost: 10});
	this.field('content');
	this.ref('id');
})
// add each document to be index
for(var index in docs) {
	var tmp = {
		id: docs[index].id,
		title: locdau(docs[index].title),
		content: locdau(docs[index].content)
	};
	idx.add(tmp);
}

function locdau(str_in){
	var str = str_in;
	str= str.toLowerCase();
	str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
	str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
	str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
	str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
	str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
	str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
	str= str.replace(/đ/g,"d");
	str= str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g,"-");
	str= str.replace(/-+-/g,"-");
	str= str.replace(/^\-+|\-+$/g,"");
	str= str.replace("/-/g", " ");
	return str;
}
