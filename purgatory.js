/*
  Copyright (c) 2009 Johan Nordberg
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

var purgatory = function(html, options){
  
  var defaultOptions = {
    allow: 'h1,h2,h3,h4,h5,h6,p,img[width height alt src]',
    ignore: 'script,style,#comment'
  };
  
  if (!options)
    var options = {};
  
  for (var key in defaultOptions) {
    if (!options[key])
      options[key] = defaultOptions[key];
  }
  
  var allowed = {};
  var allowTags = options.allow.split(',');
  for (var i=0; i < allowTags.length; i++) {
    var a = allowTags[i].split('[');
    if (a[1]) {
      allowed[a[0]] = a[1].substr(0, a[1].length-1).split(' ');
    } else {
      allowed[allowTags[i]] = [];
    }
  };
  
  var ignored = options.ignore.split(',');
  
  var rootNode = document.createElement('div');
  rootNode.innerHTML = html;
  
  function cleanNode(node){
    var rv = [];
    for (var child_idx=0; child_idx < node.childNodes.length; child_idx++) {
      var child = node.childNodes[child_idx];
      var childName = child.nodeName.toLowerCase();
      if (childName == '#text') {
        rv.push(child.data.replace(/^\s{2,}|\s{2,}$/g, ' '));
      } else if (allowed[childName]) {
        var allowedAttrs = allowed[childName];
        rv.push('<' + childName);
        if (allowedAttrs.length > 0) {
          for (var attr_idx=0; attr_idx < child.attributes.length; attr_idx++) {
            var attr = child.attributes[attr_idx];
            var attrName = attr.nodeName.toLowerCase();
            if (allowedAttrs.indexOf(attrName) != -1) {
              rv.push(' ' + attrName + '="' + attr.nodeValue + '"');
            }
          }
        }
        rv.push('>');
        rv.push(cleanNode(child));
        rv.push('</' + childName + '>\n');
      } else if (ignored.indexOf(childName) == -1) {
        rv.push(cleanNode(child));
      }
    }
    return rv.join('');
  }
  
  var cleanHtml = cleanNode(rootNode);
  
  delete rootNode;
  
  // remove empty tags
  cleanHtml = cleanHtml.replace(/<[^\/>]*>([\s]?)*<\/[^>]*>/g, '');
  
  // fix image tags
  cleanHtml = cleanHtml.replace(/><\/img>/g, '/>');
  
  return cleanHtml;
}



