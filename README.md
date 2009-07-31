# purgatory

Easy html cleaning

## Example

    var crappyHtml = '<div nonsense="10"><p><p></span>Yo!</blalba></div></p>';
    var niceHtml = purgatory(crappyHtml, {
      allow: 'h1,h2,h3,h4,h5,h6,p,img[src alt]'
    });
    
    // niceHtml = '<p>Yo!</p>';

## Documentation

Todo
