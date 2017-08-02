var application = require("application");
var context;
var numberOfImagesCreated = 0;

function getIntent(type) {
	var intent = new android.content.Intent(android.content.Intent.ACTION_SEND);
	intent.setType(type);
	return intent;
}
function share(intent, subject) {
	context = application.android.context;
	subject = subject || "How would you like to share this?";

	var shareIntent = android.content.Intent.createChooser(intent, subject);
	shareIntent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
	context.startActivity(shareIntent);
}

module.exports = {
	shareImage: function(image, subject) {
		numberOfImagesCreated ++;
		
		context = application.android.context;

		var intent = getIntent("image/jpeg");

		var stream = new java.io.ByteArrayOutputStream();
		image.android.compress(android.graphics.Bitmap.CompressFormat.JPEG, 100, stream);

		var imageFileName = "socialsharing" + numberOfImagesCreated + ".jpg";
		var newFile = new java.io.File(context.getExternalFilesDir(null), imageFileName);

		var fos = new java.io.FileOutputStream(newFile);
		fos.write(stream.toByteArray());

		fos.flush();
		fos.close();

		intent.putExtra(android.content.Intent.EXTRA_STREAM,
			android.net.Uri.fromFile(newFile));

		share(intent, subject);
	},
	shareText: function(text, subject) {
		var intent = getIntent("text/plain");

		intent.putExtra(android.content.Intent.EXTRA_TEXT, text);
		share(intent, subject);
	},
	shareAudio: function(filePath, subject) {
        var intent = getIntent("audio/mp3");
        console.log('intent: ' + intent);

        var javaFile = new java.io.File(filePath);
        console.log('javaFile: ' + javaFile);

		intent.putExtra(android.content.Intent.EXTRA_STREAM,
			android.net.Uri.fromFile(javaFile));

		share(intent, subject);
	}
};
