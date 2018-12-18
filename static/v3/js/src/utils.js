postJSON = function(url,data){
    return $.ajax({url:url,data:JSON.stringify(data),type:'POST', contentType:'application/json'});
};

/**
 * Created by toanalien on 7/15/2016.
 */

function setCookie(cname, cvalue, hours) {
    var d = new Date();
    d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";";
}

// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
//var csrftoken = getCookie((typeof CSRF_COOKIE_NAME === 'undefined') ? 'csrftoken' : CSRF_COOKIE_NAME);
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


function closeFormEdit(link) {

    self.location = link;


}


function exportPDF(iddiv) {

    var exam_html = $('#' + iddiv).html();


    $('#content').val(exam_html);


    document.exam.submit();
    /*

     $.ajax({
     type: 'POST',
     url: "/export_pdf",
     data: "content="+content,
     success: function(data){

     }

     });

     */

}


$(document).ready(function () {

    $(":submit").addClass("btn");
    $("button").addClass("btn");
});

function submitForm() {


    document.myFormUpload.submit();

}


/*
 * Daniel Thalmann
 * février 2009
 * info@thalmann.li
 */
var JQE_MODE_VIEW = "view";
var JQE_MODE_HTML = "html";
jQuery.fn.richtextarea = function (b, a) {
    for (i = 0; i < this.length; i++) {
        if ((typeof (b) == "object" || typeof (b) == "undefined") && typeof (this[i].richtextarea) == "undefined") {
            editor = new richtextarea();
            editor.setOptions(b);
            editor.initEditor(this[i])
        } else {
            ret = this[i].richtextarea.execFunc(b, a)
        }
    }
    if (typeof (ret) != "undefined") {
        return ret
    } else {
        return this
    }
};
richtextarea = function () {
    this.container = null;
    this.window = null;
    this.document = null;
    this.nodeName = "";
    this.fontFamily = "";
    this.textareaHTML = null;
    this.navigationPath = [];
    this.navBar = null;
    this.options = {
        indentTab: true, tabCode: true, mode: JQE_MODE_VIEW, onChange: function () {
        }, toolbar: true, navigationPath: false
    };
    this.execFunc = function (b, a) {
        switch (b) {
            case "bold":
                this.setBold();
                break;
            case "italic":
                this.setItalic();
                break;
            case "switch":
                this.switchMode();
                break;
            case "gethtml":
                return this.getHtml();
                break
        }
    };
    this.setOptions = function (a) {
        if (typeof (a) == "object") {
            if (typeof (a.mode) != "undefined") {
                this.options.mode = a.mode
            }
            if (typeof (a.onChange) != "undefined") {
                this.options.onChange = a.onChange
            }
            if (typeof (a.navigationPath) != "undefined") {
                this.options.navigationPath = a.navigationPath
            }
            if (typeof (a.toolbar) != "undefined") {
                this.options.toolbar = a.toolbar
            }
        }
    };
    this.initEditor = function (a) {
        this.nodeName = this.getNodeName(a);
        if (this.nodeName == "textarea") {
            this.textareaHTML = a;
            a.richtextarea = this;
            RichTextArea = "";
            if (this.options.toolbar) {
                RichTextArea += '<div class="ui-richtextarea-toolsbar ui-widget-header ui-widget-content ui-corner-all" unselectable="on">';
                RichTextArea += '<a href="#" class="ui-richtextarea-button ui-state-default" unselectable="on"><span class="ui-richtextarea-icon-bold ui-richtextarea-icon">Bold</span></a>';
                RichTextArea += '<a href="#" class="ui-richtextarea-button ui-state-default" unselectable="on"><span class="ui-richtextarea-icon-italic ui-richtextarea-icon">Italic</span></a>';
                RichTextArea += "</div>"
            }
            RichTextArea += '<div class="ui-richtextarea-content ui-widget-content">';
            RichTextArea += "</div>";
            if (this.options.navigationPath) {
                RichTextArea += '<div class="ui-richtextarea-navbar ui-corner-all ui-widget-content">';
                RichTextArea += "</div>"
            }
            editor = document.createElement("div");
            jQuery(editor).html(RichTextArea);
            jQuery(editor).addClass("ui-widget ui-richtextarea ui-widget-content ui-corner-all");
            jQuery(a).after(editor);
            if (this.options.navigationPath) {
                this.navBar = jQuery(editor).find(".ui-richtextarea-navbar").get(0)
            }
            if (this.options.toolbar) {
                jQuery(editor).find(".ui-richtextarea-button").hover(function () {
                    jQuery(this).addClass("ui-state-hover")
                }, function () {
                    jQuery(this).removeClass("ui-state-hover")
                });
                jQuery(editor).find(".ui-richtextarea-button").mousedown(function (b) {
                    return false
                });
                jQuery(editor).find(".ui-richtextarea-icon-italic").get(0).richtextarea = this;
                jQuery(editor).find(".ui-richtextarea-icon-italic").click(function () {
                    this.richtextarea.setItalic()
                });
                jQuery(editor).find(".ui-richtextarea-icon-bold").get(0).richtextarea = this;
                jQuery(editor).find(".ui-richtextarea-icon-bold").click(function () {
                    this.richtextarea.setBold()
                })
            }
            a = jQuery(editor).find(".ui-richtextarea-content").get(0);
            jQuery(a).html(jQuery(this.textareaHTML).text());
            jQuery(a).height(jQuery(this.textareaHTML).height());
            jQuery(editor).width(jQuery(this.textareaHTML).width());
            jQuery(this.textareaHTML).hide()
        }
        a.richtextarea = this;
        this.fontFamily = jQuery(a).css("font-family");
        this.container = a;
        this.window = window;
        this.document = window.document;
        this._activEditMode();
        this._attachEvent()
    };
    this._activEditMode = function () {
        this.container.designMode = "On";
        this.container.contentEditable = true
    };
    this._attachEvent = function () {
        jQuery(this.container).keydown(function (a) {
            return this.richtextarea.onKeyDown(a)
        });
        jQuery(this.container).dblclick(function (a) {
            return this.richtextarea.onDblClick(a)
        });
        jQuery(this.container).mouseup(function (a) {
            return this.richtextarea.onMouseUp(a)
        });
        jQuery(this.container).keyup(function (a) {
            return this.richtextarea.onKeyUp(a)
        })
    };
    this.onMouseUp = function (a) {
        this.setNavigationPath();
        return true
    };
    this.onDblClick = function (a) {
        return true
    };
    this.onChange = function (a) {
        if (this.textareaHTML) {
            jQuery(this.textareaHTML).html(this.HtmlEncode(this.getHtml()))
        }
        if (typeof (this.options.onChange) == "function") {
            this.options.onChange(a)
        }
        return true
    };
    this.onSwitchMode = function (a) {
        return true
    };
    this.onKeyDown = function (a) {
        if (window.event) {
            keyNum = a.keyCode
        } else {
            if (a.which) {
                keyNum = a.which;
                if (keyNum == 0) {
                    keyNum = a.keyCode
                }
            }
        }
        if (this.options.indentTab) {
            if (keyNum == 9) {
                this.stopPropagation(a);
                return false
            }
        }
        if (keyNum == 13) {
            if (jQuery.browser.msie) {
                this.insertHtml("<br/>", true);
                this.stopPropagation(a);
                this.onChange({func: "onKeyDown", event: a});
                return false
            }
        }
        this.onChange({func: "onKeyDown", event: a});
        return true
    };
    this.onKeyUp = function (a) {
        this.setNavigationPath();
        this.onChange({func: "onKeyUp", event: a})
    };
    this.getSelection = function () {
        if (typeof (this.document.selection) != "undefined") {
            return this.document.selection
        } else {
            return this.window.getSelection()
        }
    };
    this.createRange = function (a) {
        if (typeof (a) != "undefined") {
            if (typeof (a.createRange) != "undefined") {
                return a.createRange()
            } else {
                if (a.rangeCount > 0) {
                    return a.getRangeAt(0)
                } else {
                    return null
                }
            }
        } else {
            if (typeof (this.document.selection) != "undefined") {
                return this.document.selection.createRange()
            } else {
                return this.document.createRange()
            }
        }
    };
    this.setNavigationPath = function () {
        if (!this.options.navigationPath) {
            return
        }
        element = this.getParentSelection();
        jQuery(this.navBar).html("");
        this.navigationPath = [];
        i = 0;
        while (element != this.container && typeof (element) != "undefined" && element.parentNode != null) {
            if (element.parentNode) {
                this.navigationPath[i] = element;
                element = element.parentNode;
                i++
            }
        }
        for (i = this.navigationPath.length - 1; i > -1; i--) {
            if (this.navigationPath[i].nodeType != 3) {
                jQuery(this.navBar).append('<a href="#" class="ui-richtextarea-nav' + i + ' ui-state-default" unselectable="on"><span>' + this.getNodeName(this.navigationPath[i]) + "</span></a>");
                navButton = jQuery(this.navBar).find(".ui-richtextarea-nav" + i).get(0);
                navButton.richtextarea = this;
                navButton.selElement = this.navigationPath[i];
                jQuery(navButton).click(function () {
                    this.richtextarea.selectElement(this.selElement)
                })
            }
        }
    };
    this.getParentSelection = function () {
        element = undefined;
        selection = this.getSelection();
        range = this.createRange(selection);
        if (typeof (selection.type) != "undefined") {
            if (selection.type == "Control") {
                element = range(0).parentNode
            } else {
                element = range.parentElement()
            }
        } else {
            element = range.startContainer;
            if (element.nodeType == 3) {
                if (element.textContent == "") {
                    element = element.nextSibling
                }
            }
        }
        if (element.nodeType == 3) {
            element = element.parentNode
        }
        return element
    };
    this.selectElement = function (a) {
        selection = this.getSelection();
        if (typeof (selection.selectAllChildren) != "undefined") {
            selection.selectAllChildren(a)
        } else {
            end_range = this.createRange();
            start_range = end_range.duplicate();
            start_range.moveToElementText(a);
            start_range.setEndPoint("EndToEnd", end_range);
            a.selectionStart = start_range.text.length - end_range.text.length;
            a.selectionEnd = a.selectionStart + end_range.text.length
        }
    };
    this.insertHtml = function (b, a) {
        if (typeof (a) == "undefined") {
            a = true
        }
        this.container.focus();
        selection = this.getSelection();
        range = this.createRange(selection);
        if (jQuery.browser.msie) {
            this.document.execCommand("delete", false, null);
            range.HTMLText = "";
            range.pasteHTML(b);
            range.collapse(false);
            if (a) {
                divElement = this.document.createElement("div");
                divElement.innerHTML = b;
                text = divElement.innerText;
                textLength = text.length;
                if (textLength > 0) {
                    range.moveStart("character", -textLength)
                }
                range.select()
            }
        } else {
            range.deleteContents();
            selection.removeAllRanges();
            rangeElement = this.createRange();
            fragment = rangeElement.createContextualFragment(b);
            firstElement = fragment.firstChild;
            if (firstElement.nodeType == 3) {
                if (firstElement.textContent == " ") {
                    fragment.removeChild(firstElement);
                    firstElement = fragment.firstChild
                }
            }
            lastElement = fragment.lastChild;
            nodeStart = range.startContainer;
            offset = range.startOffset;
            switch (nodeStart.nodeType) {
                case 3:
                    if (fragment.nodeType == 3) {
                        nodeStart.insertData(offset, fragment.data);
                        range = this.createRange();
                        range.setEnd(nodeStart, offset + fragmentLength);
                        range.setStart(nodeStart, offset + fragmentLength);
                        selection.addRange(range)
                    } else {
                        nodeStart = nodeStart.splitText(offset);
                        nodeStart.parentNode.insertBefore(fragment, nodeStart)
                    }
                    break;
                case 1:
                    nodeStart.insertBefore(fragment, nodeStart.childNodes[offset]);
                    break
            }
            if (a) {
                if (firstElement != null && lastElement.nextSibling != null) {
                    range = this.createRange();
                    range.setStart(firstElement, 0);
                    range.setEnd(lastElement.nextSibling, 0);
                    selection.removeAllRanges();
                    selection.addRange(range)
                }
            }
        }
        this.setNavigationPath()
    };
    this.getSelectedFragment = function () {
        selection = this.getSelection();
        range = this.createRange(selection);
        if (typeof (range.htmlText) != "undefined") {
            return this.getFragment(range.htmlText)
        } else {
            if (range.collapsed) {
                return null
            }
            divElement = this.document.createElement("div");
            divElement.appendChild(range.cloneContents());
            return divElement
        }
    };
    this.getSelectedHtml = function () {
        selection = this.getSelection();
        range = this.createRange(selection);
        if (jQuery.browser.msie) {
            return range.htmlText
        } else {
            if (range.collapsed) {
                return ""
            }
            fragment = range.cloneContents();
            divElement = this.document.createElement("div");
            jQuery(divElement).append(fragment);
            return jQuery(divElement).html()
        }
    };
    this.setStyle2 = function (b, a, c) {
        fragment = this.getSelectedFragment();
        this.setAllStyleStyle(fragment, b, a, c);
        this.insertHtml(jQuery(fragment).html())
    };
    this.setAllStyleStyle = function (b, c, a, d) {
        for (i = 0; i < b.childNodes.length; i++) {
            this.setAllStyleStyle(b.childNodes[i], c, a, d)
        }
        if (b.nodeType == 3) {
            myParent = b.parentNode;
            if (this.getNodeName(myParent) == "span") {
                this.setElementStyle(myParent, c, a, d)
            } else {
                spanElement = this.document.createElement("span");
                this.setElementStyle(spanElement, c, a, d);
                jQuery(b).after(spanElement);
                jQuery(spanElement).append(b)
            }
        }
    };
    this.setElementStyle = function (b, c, a, d) {
        currentValue = new String(jQuery(b).css(c));
        finded = false;
        if (typeof (a) == "object") {
            for (index in a) {
                if (currentValue.toLowerCase() == a[index].toLowerCase()) {
                    finded = true;
                    break
                }
            }
            setValue = a[0]
        } else {
            if (currentValue.toLowerCase() == a.toLowerCase()) {
                finded = true
            }
            setValue = a
        }
        if (finded) {
            jQuery(b).css(c, d)
        } else {
            jQuery(b).css(c, setValue)
        }
    };
    this.setStyle = function (b, a, c) {
        html = this.getSelectedHtml();
        parentSelection = this.getParentSelection();
        nodeName = this.getNodeName(parentSelection);
        if (parentSelection) {
            if (parentSelection.nodeType == 3) {
                parentcontent = parentSelection.textContent.toLowerCase()
            } else {
                parentcontent = parentSelection.innerHTML.toLowerCase()
            }
        }
        if (html == "") {
            return
        }
        if (this.outerHTML(parentSelection).toLowerCase() == html.toLowerCase() && nodeName == "span") {
            this.setElementStyle(parentSelection, b, a, c)
        } else {
            if (typeof (a) == "object") {
                this.insertHtml('<span style="' + b + ":" + a[0] + ';">' + html + "</span>")
            } else {
                this.insertHtml('<span style="' + b + ":" + a + ';">' + html + "</span>")
            }
        }
    };
    this.clearObsoletSpan = function () {
        jQuery(this.container).find("span").each(function () {
            if (jQuery(this).html() == "") {
                jQuery(this).remove()
            }
        })
    };
    this.HtmlEncode = function (a) {
        a = new String(a);
        a = a.replace(/&/g, "&amp;");
        a = a.replace(/"/g, "&quot;");
        a = a.replace(/</g, "&lt;");
        a = a.replace(/>/g, "&gt;");
        a = a.replace(/\'/g, "&#39;");
        return a
    };
    this.HtmlDecode = function (a) {
        a = new String(a);
        a = a.replace(/&quot;/g, '"');
        a = a.replace(/&amp;/g, "&");
        a = a.replace(/&#39;/g, "'");
        a = a.replace(/&lt;/g, "<");
        a = a.replace(/&gt;/g, ">");
        return a
    };
    this.switchMode = function () {
        if (this.options.mode == JQE_MODE_VIEW) {
            this.options.mode = JQE_MODE_HTML;
            this.container.innerHTML = this.HtmlEncode(this.container.innerHTML);
            jQuery(this.container).css("font-family", "Courier New")
        } else {
            this.options.mode = JQE_MODE_VIEW;
            this.container.innerHTML = this.HtmlDecode(this.container.innerHTML);
            jQuery(this.container).css("font-family", this.fontFamily)
        }
        this.onSwitchMode({mode: this.options.mode})
    };
    this.getFragment = function (a) {
        fragment = this.document.createElement("div");
        jQuery(fragment).html(a);
        return fragment
    };
    this.getHtml = function () {
        if (this.options.mode == JQE_MODE_VIEW) {
            return this.container.innerHTML
        } else {
            return jQuery(this.container).text()
        }
    };
    this.setHtml = function (a) {
        this.container.innerHTML = a;
        this.onChange({func: "setHtml"})
    };
    this.setBold = function () {
        if (this.options.mode == JQE_MODE_HTML) {
            return
        }
        this.document.execCommand("bold", false, null);
        this.onChange({func: "setBold"})
    };
    this.setItalic = function () {
        if (this.options.mode == JQE_MODE_HTML) {
            return
        }
        this.document.execCommand("italic", false, null);
        this.onChange({func: "setItalic"})
    };
    this.setColor = function (a) {
        if (this.options.mode == JQE_MODE_HTML) {
            return
        }
        this.document.execCommand("forecolor", false, a);
        this.onChange({func: "setColor"})
    };
    this.setLink = function (a) {
        if (this.options.mode == JQE_MODE_HTML) {
            return
        }
        this.container.focus();
        if (a == "" || !a) {
            if (jQuery.browser.msie) {
                this.document.execCommand("createlink", true, "")
            } else {
                a = window.prompt("Url", "http://");
                this.document.execCommand("createlink", false, a)
            }
        } else {
            this.document.execCommand("createlink", false, a)
        }
        this.onChange({func: "setLink", link: a})
    };
    this.deleteSelection = function () {
        this.document.execCommand("delete", false, null);
        this.onChange({func: "deleteSelection"})
    };
    this.setIndent = function () {
        if (this.options.mode == JQE_MODE_HTML) {
            return
        }
        this.document.execCommand("indent", false, null);
        this.onChange({func: "setIndent"})
    };
    this.setFontSize = function (a) {
        if (this.options.mode == JQE_MODE_HTML) {
            return
        }
        this.setStyle("font-size", a, "medium");
        this.onChange({func: "setFontSize", size: a})
    };
    this.removeFormat = function () {
        if (this.options.mode == JQE_MODE_HTML) {
            return
        }
        if (jQuery.browser.msie) {
            divElement = this.document.createElement("div");
            jQuery(divElement).html(this.getSelectedHtml());
            jQuery(divElement).find("span").each(function () {
                jQuery(this).attr("style", " ")
            });
            this.insertHtml(jQuery(divElement).html());
            this.clearObsoletSpan()
        } else {
            this.document.execCommand("removeformat", false, null)
        }
        this.onChange({func: "removeFormat"})
    };
    this.stopPropagation = function (a) {
        if (!a) {
            a = window.event;
            a.cancelBubble = true
        }
        if (a.stopPropagation) {
            a.stopPropagation()
        }
    };
    this.getNodeName = function (a) {
        if (typeof (a.tagName) != "undefined") {
            return a.tagName.toLowerCase()
        } else {
            return a.nodeName.toLowerCase()
        }
    };
    this.outerHTML = function (a) {
        if (typeof (a.outerHTML) != "undefined") {
            return a.outerHTML
        } else {
            divElement = this.document.createElement("div");
            newElement = a.cloneNode(true);
            jQuery(divElement).append(newElement);
            return jQuery(divElement).html()
        }
    }
};

/*--------------------------------------------------*/
var JQE_MODE_VIEW = 'view';
var JQE_MODE_HTML = 'html';

jQuery.fn.richtextarea = function (args, attrs) {

    for (i = 0; i < this.length; i++) {
        if ((typeof (args) == 'object' || typeof (args) == 'undefined') && typeof (this[i].richtextarea) == 'undefined') {
            editor = new richtextarea();
            editor.setOptions(args);
            editor.initEditor(this[i]);
        }
        else {
            ret = this[i].richtextarea.execFunc(args, attrs);
        }
    }
    if (typeof (ret) != 'undefined')
        return ret;
    else
        return this;
};

richtextarea = function () {

    this.container = null;
    this.window = null;
    this.document = null;
    this.nodeName = "";
    this.fontFamily = '';
    this.textareaHTML = null;
    this.navigationPath = [];
    this.navBar = null;

    this.options = {
        indentTab: true,
        tabCode: true,
        mode: JQE_MODE_VIEW,
        onChange: function () {
        },
        toolbar: true,
        navigationPath: false
    };

    this.execFunc = function (func, attr) {

        switch (func) {
            case 'bold':
                this.setBold();
                break;
            case 'italic':
                this.setItalic();
                break;
            case 'switch':
                this.switchMode();
                break;
            case 'gethtml':
                return this.getHtml();
                break;
        }
    };

    this.setOptions = function (newOptions) {
        if (typeof (newOptions) == 'object') {
            /*			if (typeof (newOptions.indentTab) != 'undefined')
             this.options.indentTab = newOptions.indentTab;
             if (typeof (newOptions.tabCode) != 'undefined')
             this.options.tabCode = newOptions.tabCode;
             */
            if (typeof (newOptions.mode) != 'undefined')
                this.options.mode = newOptions.mode;
            if (typeof (newOptions.onChange) != 'undefined')
                this.options.onChange = newOptions.onChange;
            if (typeof (newOptions.navigationPath) != 'undefined')
                this.options.navigationPath = newOptions.navigationPath;
            if (typeof (newOptions.toolbar) != 'undefined')
                this.options.toolbar = newOptions.toolbar;
        }
    };

    this.initEditor = function (element) {

        this.nodeName = this.getNodeName(element);

        // si c'est un textarea, on le substitue
        if (this.nodeName == 'textarea') {

            // enregistre le lien du textarea
            this.textareaHTML = element;
            element.richtextarea = this;

            RichTextArea = '';
            if (this.options.toolbar) {
                RichTextArea += '<div class="ui-richtextarea-toolsbar ui-widget-header ui-widget-content ui-corner-all" unselectable="on">';
                RichTextArea += '<a href="#" class="ui-richtextarea-button ui-state-default" unselectable="on"><span class="ui-richtextarea-icon-bold ui-richtextarea-icon">Bold</span></a>';
                RichTextArea += '<a href="#" class="ui-richtextarea-button ui-state-default" unselectable="on"><span class="ui-richtextarea-icon-italic ui-richtextarea-icon">Italic</span></a>';
                RichTextArea += '</div>';
            }
            RichTextArea += '<div class="ui-richtextarea-content ui-widget-content">';
            RichTextArea += '</div>';

            if (this.options.navigationPath) {
                RichTextArea += '<div class="ui-richtextarea-navbar ui-corner-all ui-widget-content">';
                RichTextArea += '</div>';
            }

            editor = document.createElement("div");
            // ajoute dans le nouveau div l'interface enrichi
            jQuery(editor).html(RichTextArea);
            jQuery(editor).addClass('ui-widget ui-richtextarea ui-widget-content ui-corner-all');

            jQuery(element).after(editor);

            if (this.options.navigationPath) {
                this.navBar = jQuery(editor).find('.ui-richtextarea-navbar').get(0);
            }

            if (this.options.toolbar) {
                jQuery(editor).find('.ui-richtextarea-button').hover(function () {
                    jQuery(this).addClass('ui-state-hover');
                }, function () {
                    jQuery(this).removeClass('ui-state-hover');
                });
                jQuery(editor).find('.ui-richtextarea-button').mousedown(function (e) {
                    return false;
                });
                jQuery(editor).find('.ui-richtextarea-icon-italic').get(0).richtextarea = this;
                jQuery(editor).find('.ui-richtextarea-icon-italic').click(function () {
                    this.richtextarea.setItalic();
                });
                jQuery(editor).find('.ui-richtextarea-icon-bold').get(0).richtextarea = this;
                jQuery(editor).find('.ui-richtextarea-icon-bold').click(function () {
                    this.richtextarea.setBold();
                });
            }

            // spécifie le nouveau container
            element = jQuery(editor).find('.ui-richtextarea-content').get(0);

            jQuery(element).html(jQuery(this.textareaHTML).text());
            jQuery(element).height(jQuery(this.textareaHTML).height());
            jQuery(editor).width(jQuery(this.textareaHTML).width());

            jQuery(this.textareaHTML).hide();
        }

        element.richtextarea = this;

        this.fontFamily = jQuery(element).css('font-family');
        this.container = element;
        this.window = window;
        this.document = window.document;

        this._activEditMode();
        this._attachEvent();

    };

    // initialise le mode d'édition
    this._activEditMode = function () {
        // active le mode d'édition de l'élément
        this.container.designMode = 'On';
        this.container.contentEditable = true;
    };
    // initialise les événements attaché à l'élément
    this._attachEvent = function () {
        jQuery(this.container).keydown(function (event) {
            return this.richtextarea.onKeyDown(event)
        });
        jQuery(this.container).dblclick(function (event) {
            return this.richtextarea.onDblClick(event)
        });
        jQuery(this.container).mouseup(function (event) {
            return this.richtextarea.onMouseUp(event)
        });
        jQuery(this.container).keyup(function (event) {
            return this.richtextarea.onKeyUp(event)
        });
    };

    //
    this.onMouseUp = function (e) {
        this.setNavigationPath();
        return true;
    };
    //
    this.onDblClick = function (e) {

        return true;
    };

    // fonction executé lors d'un changement de text
    this.onChange = function (e) {

        if (this.textareaHTML) {
            jQuery(this.textareaHTML).html(this.HtmlEncode(this.getHtml()));
        }

        if (typeof (this.options.onChange) == 'function') {
            this.options.onChange(e);
        }

        return true;
    };

    // fonction executé lors d'un changement de mode
    this.onSwitchMode = function (e) {

        return true;
    };

    this.onKeyDown = function (e) {

        // obtient le code du caractère pressé
        if (window.event) { // IE
            keyNum = e.keyCode;
        }
        else if (e.which) {// Netscape/Firefox/Opera
            keyNum = e.which;
            if (keyNum == 0)
                keyNum = e.keyCode;
        }


        if (this.options.indentTab) {

            if (keyNum == 9) {

                //this.container.focus();
                //this.insertHtml('<span style="margin-right:20px;">&nbsp;</span>', true);
                //this.insertHtml("<br/>", true);
                //this.insertHtml("<li></li>", true);

                // get caret position/selection
                var start = 4;//this.selectionStart;
                end = 5;//this.selectionEnd;

                //alert(start);

                var $this = $(this);

                // set textarea value to: text before caret + tab + text after caret
                $this.val($this.val().substring(0, start)
                    + "\t"
                    + $this.val().substring(end));

                // put caret at right position again
                this.selectionStart = this.selectionEnd = start + 1;

                // prevent the focus lose
                //return false;

                //this.document.execCommand("indent", true, null);
                //this.insertHtml('&nbsp;&nbsp;&nbsp;&nbsp;', true);
                //this.container.focus();

                this.stopPropagation(e);


                //e.stop();

                return false;

            }
        }

        if (keyNum == 13) {

            if (jQuery.browser.msie) {

                this.insertHtml("<br/>", true);
                this.stopPropagation(e);

                this.onChange({'func': 'onKeyDown', 'event': e});

                return false;

            }
        }

        this.onChange({'func': 'onKeyDown', 'event': e});
        return true;
    };

    this.onKeyUp = function (e) {
        this.setNavigationPath();
        this.onChange({'func': 'onKeyUp', 'event': e});
    };


    // obtient un objet de selection
    this.getSelection = function () {
        // IE
        if (typeof (this.document.selection) != 'undefined')
            return this.document.selection;
        else
            return this.window.getSelection();
    };

    // retourne un objet textRange pour internet explorer
    // et un objet Range pour mozilla et autre...
    this.createRange = function (selection) {
        if (typeof (selection) != "undefined") {
            // IE
            if (typeof (selection.createRange) != 'undefined')
                return selection.createRange();
            else {
                if (selection.rangeCount > 0)
                    return selection.getRangeAt(0);
                else
                    return null;
            }
        }
        else {
            // IE
            if (typeof (this.document.selection) != 'undefined')
                return this.document.selection.createRange();
            else
                return this.document.createRange();
        }
    };

    // rempli la structure des parents de la selection courante.
    this.setNavigationPath = function () {
        if (!this.options.navigationPath)
            return;

        element = this.getParentSelection();
        jQuery(this.navBar).html('');
        this.navigationPath = [];
        i = 0;

        while (element != this.container && typeof (element) != 'undefined' && element.parentNode != null) {
            //go through the elements and build the path
            if (element.parentNode) {
                this.navigationPath[i] = element;
                element = element.parentNode;
                i++;
            }
        }

        // jQuery(this.navBar).append('<a href="#" class="ui-state-default" unselectable="on"><span>Container</span></a>');

        for (i = this.navigationPath.length - 1; i > -1; i--) {
            if (this.navigationPath[i].nodeType != 3) {
                jQuery(this.navBar).append('<a href="#" class="ui-richtextarea-nav' + i + ' ui-state-default" unselectable="on"><span>' + this.getNodeName(this.navigationPath[i]) + '</span></a>');
                navButton = jQuery(this.navBar).find('.ui-richtextarea-nav' + i).get(0);
                navButton.richtextarea = this;
                navButton.selElement = this.navigationPath[i];
                jQuery(navButton).click(function () {
                    this.richtextarea.selectElement(this.selElement);
                });
            }
        }
    };

    // obtiens le noeud parent de la selection
    this.getParentSelection = function () {
        element = undefined;
        selection = this.getSelection();
        range = this.createRange(selection);
        // IE
        if (typeof (selection.type) != 'undefined') {
            if (selection.type == "Control") {
                element = range(0).parentNode;
            }
            else {
                element = range.parentElement();
            }
        } else {
            element = range.startContainer;
            if (element.nodeType == 3) {
                if (element.textContent == '') {
                    element = element.nextSibling;
                }
            }
        }
        if (element.nodeType == 3) {
            element = element.parentNode;
        }

        return element;

    };

    // selectionne un élément
    this.selectElement = function (element) {

        selection = this.getSelection();
        if (typeof (selection.selectAllChildren) != 'undefined') {
            selection.selectAllChildren(element);
        }
        else {
            // The current selection
            end_range = this.createRange();
            // We'll use this as a 'dummy'
            start_range = end_range.duplicate();
            // Select all text
            start_range.moveToElementText(element);
            // Now move 'dummy' end point to end point of original range
            start_range.setEndPoint('EndToEnd', end_range);
            // Now we can calculate start and end points
            element.selectionStart = start_range.text.length - end_range.text.length;
            element.selectionEnd = element.selectionStart + end_range.text.length;
        }
    };

    // insert un contenu html dans la selection
    this.insertHtml = function (html, selectInsert) {
        if (typeof (selectInsert) == 'undefined')
            selectInsert = true;


        this.container.focus();

        selection = this.getSelection();
        range = this.createRange(selection);

        if (jQuery.browser.msie) {

            this.document.execCommand("delete", false, null);
            range.HTMLText = "";
            range.pasteHTML(html);
            range.collapse(false);

            if (selectInsert) {
                divElement = this.document.createElement("div");
                divElement.innerHTML = html;
                text = divElement.innerText;
                textLength = text.length;
                if (textLength > 0)
                    range.moveStart("character", -textLength);
                range.select();
            }
        }
        else {

            range.deleteContents();
            selection.removeAllRanges();

            rangeElement = this.createRange();
            fragment = rangeElement.createContextualFragment(html);
            firstElement = fragment.firstChild;
            if (firstElement.nodeType == 3) {
                if (firstElement.textContent == ' ') {
                    fragment.removeChild(firstElement);
                    firstElement = fragment.firstChild;
                }
            }
            lastElement = fragment.lastChild;

            nodeStart = range.startContainer;
            offset = range.startOffset;

            switch (nodeStart.nodeType) {
                case 3: // TEXT_NODE
                    if (fragment.nodeType == 3) { // TEXT_NODE
                        nodeStart.insertData(offset, fragment.data);
                        range = this.createRange();
                        range.setEnd(nodeStart, offset + fragmentLength);
                        range.setStart(nodeStart, offset + fragmentLength);
                        selection.addRange(range);
                    }
                    else {
                        nodeStart = nodeStart.splitText(offset);
                        nodeStart.parentNode.insertBefore(fragment, nodeStart);

                    }
                    break;

                case 1: // ELEMENT_NODE
                    nodeStart.insertBefore(fragment, nodeStart.childNodes[offset]);
                    break;
            }

            // sélection l'insertion du code HTML
            //
            if (selectInsert) {
                if (firstElement != null && lastElement.nextSibling != null) {
                    range = this.createRange();
                    range.setStart(firstElement, 0);
                    range.setEnd(lastElement.nextSibling, 0);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }

        }

        this.setNavigationPath();

    };

    //
    // retourne un fragment de la selection
    this.getSelectedFragment = function () {

        selection = this.getSelection();
        range = this.createRange(selection);

        if (typeof (range.htmlText) != 'undefined') {
            return this.getFragment(range.htmlText);
        }
        else {
            if (range.collapsed) {
                return null;
            }
            divElement = this.document.createElement("div");
            divElement.appendChild(range.cloneContents());

            return divElement;
        }
    };

    //
    // retourne le contenu Html de la selection
    this.getSelectedHtml = function () {

        selection = this.getSelection();
        range = this.createRange(selection);

        if (jQuery.browser.msie) {
            return range.htmlText;
        }
        else {
            if (range.collapsed) {
                return '';
            }
            // return range.toString();

            fragment = range.cloneContents();
            divElement = this.document.createElement("div");
            jQuery(divElement).append(fragment);

            return jQuery(divElement).html();

        }
    };

    this.setStyle2 = function (style, setValues, unsetValue) {

        fragment = this.getSelectedFragment();
        this.setAllStyleStyle(fragment, style, setValues, unsetValue);
        this.insertHtml(jQuery(fragment).html());

    };

    this.setAllStyleStyle = function (fragment, style, setValues, unsetValue) {

        for (i = 0; i < fragment.childNodes.length; i++) {
            //	if (fragment.childNodes[i].childNodes.length > 0) {
            this.setAllStyleStyle(fragment.childNodes[i], style, setValues, unsetValue);
            //	}
        }
        if (fragment.nodeType == 3) {
            myParent = fragment.parentNode;
            if (this.getNodeName(myParent) == 'span') {
                this.setElementStyle(myParent, style, setValues, unsetValue);
            }
            else {
                spanElement = this.document.createElement("span");
                this.setElementStyle(spanElement, style, setValues, unsetValue);
                jQuery(fragment).after(spanElement);
                jQuery(spanElement).append(fragment);
            }
        }

    };

    // aplique un style à un élément ou supprime-le
    this.setElementStyle = function (element, style, setValues, unsetValue) {

        currentValue = new String(jQuery(element).css(style));
        finded = false;

        if (typeof (setValues) == 'object') {
            for (index in setValues) {
                if (currentValue.toLowerCase() == setValues[index].toLowerCase()) {
                    finded = true;
                    break;
                }
            }
            setValue = setValues[0];
        }
        else {
            if (currentValue.toLowerCase() == setValues.toLowerCase()) {
                finded = true;
            }
            setValue = setValues;
        }
        if (finded) {
            jQuery(element).css(style, unsetValue);
        }
        else {
            jQuery(element).css(style, setValue);
        }
    };


    // applique un style sur un élément span.
    // Si l'élément span n'existe pas, on l'ajoute.
    // Si le style existe avec la même valeur défini, le style est supprimé.
    // Dans le cas ou le style à tester peu prendre plusieurs valeur suivant les navigateurs,
    // on peut donner à la fonction une liste d'élément à tester.
    this.setStyle = function (style, setValues, unsetValue) {

        //this.setStyle2(style, setValues, unsetValue);
        //return;

        html = this.getSelectedHtml();
        parentSelection = this.getParentSelection();
        nodeName = this.getNodeName(parentSelection);
        if (parentSelection) {
            if (parentSelection.nodeType == 3) {
                parentcontent = parentSelection.textContent.toLowerCase();
            } else {
                parentcontent = parentSelection.innerHTML.toLowerCase();
            }
        }

        if (html == '')
            return;

        if (this.outerHTML(parentSelection).toLowerCase() == html.toLowerCase() && nodeName == 'span') {
            //if (nodeName == 'span') {
            this.setElementStyle(parentSelection, style, setValues, unsetValue);
        }
        else {

            if (typeof (setValues) == 'object') {
                this.insertHtml('<span style="' + style + ':' + setValues[0] + ';">' + html + '</span>');
            }
            else {
                this.insertHtml('<span style="' + style + ':' + setValues + ';">' + html + '</span>');
            }
        }
        /*

         if (!jQuery.browser.msie) {
         //supprimer les span vides
         this.clearObsoletSpan();
         }

         */
    };

    this.clearObsoletSpan = function () {
        jQuery(this.container).find("span").each(function () {
            if (jQuery(this).html() == "")
                jQuery(this).remove();
        });
    };

    this.HtmlEncode = function (text) {
        text = new String(text);

        text = text.replace(/&/g, "&amp;");
        text = text.replace(/"/g, "&quot;");
        text = text.replace(/</g, "&lt;");
        text = text.replace(/>/g, "&gt;");
        text = text.replace(/\'/g, '&#39;'); // 39 27
        // text = text.replace(/'/g, "&#146;") ;

        return text;
    };

    this.HtmlDecode = function (text) {
        text = new String(text);

        text = text.replace(/&quot;/g, '"');
        text = text.replace(/&amp;/g, '&');
        text = text.replace(/&#39;/g, "'");
        text = text.replace(/&lt;/g, '<');
        text = text.replace(/&gt;/g, '>');
        return text;
    };

    this.switchMode = function () {

        if (this.options.mode == JQE_MODE_VIEW) {
            this.options.mode = JQE_MODE_HTML;
            this.container.innerHTML = this.HtmlEncode(this.container.innerHTML);
            jQuery(this.container).css('font-family', 'Courier New');

        }
        else {
            this.options.mode = JQE_MODE_VIEW;
            this.container.innerHTML = this.HtmlDecode(this.container.innerHTML);
            jQuery(this.container).css('font-family', this.fontFamily);
        }

        this.onSwitchMode({'mode': this.options.mode});

    };

    this.getFragment = function (html) {
        fragment = this.document.createElement("div");
        jQuery(fragment).html(html);
        return fragment;
    };

    // obtient le code html de l'élément
    this.getHtml = function () {

        if (this.options.mode == JQE_MODE_VIEW) {
            return this.container.innerHTML;
        }
        else {
            return jQuery(this.container).text();
        }
    };

    // défini le contenu html de l'élément
    this.setHtml = function (value) {

        this.container.innerHTML = value;

        this.onChange({'func': 'setHtml'});
    };

    // applique le tag gras sur le texte sélectionné
    this.setBold = function () {
        if (this.options.mode == JQE_MODE_HTML)
            return;

        //this.setStyle('font-weight', ['bold', '700'], 'normal');
        this.document.execCommand("bold", false, null);

        this.onChange({'func': 'setBold'});
    };

    // applique le tag italique sur le texte sélectionné
    this.setItalic = function () {
        if (this.options.mode == JQE_MODE_HTML)
            return;

        //this.setStyle('font-style', 'italic', 'normal');
        this.document.execCommand("italic", false, null);

        this.onChange({'func': 'setItalic'});
    };

    this.setColor = function (color) {
        if (this.options.mode == JQE_MODE_HTML)
            return;

        // this.setStyle('color', color, '');
        this.document.execCommand("forecolor", false, color);

        this.onChange({'func': 'setColor'});
    };

    // crée un lien
    this.setLink = function (link) {
        if (this.options.mode == JQE_MODE_HTML)
            return;

        this.container.focus();
        if (link == "" || !link)
            if (jQuery.browser.msie)
                this.document.execCommand("createlink", true, "");
            else {
                link = window.prompt("Url", "http://");
                this.document.execCommand("createlink", false, link);
            }
        else
            this.document.execCommand("createlink", false, link);
        this.onChange({'func': 'setLink', 'link': link});
    };

    this.deleteSelection = function () {
        this.document.execCommand("delete", false, null);
        this.onChange({'func': 'deleteSelection'});
    };

    this.setIndent = function () {
        if (this.options.mode == JQE_MODE_HTML)
            return;

        this.document.execCommand("indent", false, null);
        this.onChange({'func': 'setIndent'});
    };

    this.setFontSize = function (size) {
        if (this.options.mode == JQE_MODE_HTML)
            return;

        //		if(jQuery.browser.msie)
        this.setStyle('font-size', size, 'medium');
        //		else
        //			this.document.execCommand("fontsize", false, size);

        this.onChange({'func': 'setFontSize', 'size': size});
    };

    this.removeFormat = function () {
        if (this.options.mode == JQE_MODE_HTML)
            return;

        if (jQuery.browser.msie) {
            divElement = this.document.createElement("div");
            jQuery(divElement).html(this.getSelectedHtml());

            jQuery(divElement).find("span").each(function () {
                jQuery(this).attr('style', ' ');
            });

            this.insertHtml(jQuery(divElement).html());
            this.clearObsoletSpan();
        }
        else {
            this.document.execCommand("removeformat", false, null);
        }
        this.onChange({'func': 'removeFormat'});
    };

    this.stopPropagation = function (e) {
        if (!e) {
            e = window.event;
            e.cancelBubble = true;
        }
        if (e.stopPropagation)
            e.stopPropagation();
    };

    this.getNodeName = function (element) {

        if (typeof (element.tagName) != 'undefined')
            return element.tagName.toLowerCase();
        else
            return element.nodeName.toLowerCase();
    };

    // retourne le code htm d'un élément avec son propre Tag
    this.outerHTML = function (element) {
        if (typeof (element.outerHTML) != 'undefined') {
            return element.outerHTML;
        }
        else {
            divElement = this.document.createElement("div");
            newElement = element.cloneNode(true);
            jQuery(divElement).append(newElement);

            return jQuery(divElement).html();
        }

    };

};

/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function ($, document, undefined) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    var config = $.cookie = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            if (decode(parts.shift()) === key) {
                var cookie = decode(parts.join('='));
                return config.json ? JSON.parse(cookie) : cookie;
            }
        }

        return null;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== null) {
            $.cookie(key, null, options);
            return true;
        }
        return false;
    };

})(jQuery, document);


// Autosize 1.13 - jQuery plugin for textareas
// (c) 2012 Jack Moore - jacklmoore.com
// license: www.opensource.org/licenses/mit-license.php

(function ($) {
    var
        defaults = {
            className: 'autosizejs',
            append: "",
            callback: false
        },
        hidden = 'hidden',
        borderBox = 'border-box',
        lineHeight = 'lineHeight',
        copy = '<textarea tabindex="-1" style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden;"/>',
    // line-height is omitted because IE7/IE8 doesn't return the correct value.
        copyStyle = [
            'fontFamily',
            'fontSize',
            'fontWeight',
            'fontStyle',
            'letterSpacing',
            'textTransform',
            'wordSpacing',
            'textIndent'
        ],
        oninput = 'oninput',
        onpropertychange = 'onpropertychange',
        test = $(copy)[0];

    // For testing support in old FireFox
    test.setAttribute(oninput, "return");

    if ($.isFunction(test[oninput]) || onpropertychange in test) {

        // test that line-height can be accurately copied to avoid
        // incorrect value reporting in old IE and old Opera
        $(test).css(lineHeight, '99px');
        if ($(test).css(lineHeight) === '99px') {
            copyStyle.push(lineHeight);
        }

        $.fn.autosize = function (options) {
            options = $.extend({}, defaults, options || {});

            return this.each(function () {
                var
                    ta = this,
                    $ta = $(ta),
                    mirror,
                    minHeight = $ta.height(),
                    maxHeight = parseInt($ta.css('maxHeight'), 10),
                    active,
                    i = copyStyle.length,
                    resize,
                    boxOffset = 0,
                    value = ta.value,
                    callback = $.isFunction(options.callback);

                if ($ta.css('box-sizing') === borderBox || $ta.css('-moz-box-sizing') === borderBox || $ta.css('-webkit-box-sizing') === borderBox) {
                    boxOffset = $ta.outerHeight() - $ta.height();
                }

                if ($ta.data('mirror') || $ta.data('ismirror')) {
                    // if autosize has already been applied, exit.
                    // if autosize is being applied to a mirror element, exit.
                    return;
                } else {
                    mirror = $(copy).data('ismirror', true).addClass(options.className)[0];

                    resize = $ta.css('resize') === 'none' ? 'none' : 'horizontal';

                    $ta.data('mirror', $(mirror)).css({
                        overflow: hidden,
                        overflowY: hidden,
                        wordWrap: 'break-word',
                        resize: resize
                    });
                }

                // Opera returns '-1px' when max-height is set to 'none'.
                maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

                // Using mainly bare JS in this function because it is going
                // to fire very often while typing, and needs to very efficient.
                function adjust() {
                    var height, overflow, original;

                    // the active flag keeps IE from tripping all over itself.  Otherwise
                    // actions in the adjust function will cause IE to call adjust again.
                    if (!active) {
                        active = true;
                        mirror.value = ta.value + options.append;
                        mirror.style.overflowY = ta.style.overflowY;
                        original = parseInt(ta.style.height, 10);

                        // Update the width in case the original textarea width has changed
                        mirror.style.width = $ta.css('width');

                        // Needed for IE to reliably return the correct scrollHeight
                        mirror.scrollTop = 0;

                        // Set a very high value for scrollTop to be sure the
                        // mirror is scrolled all the way to the bottom.
                        mirror.scrollTop = 9e4;

                        height = mirror.scrollTop;
                        overflow = hidden;
                        if (height > maxHeight) {
                            height = maxHeight;
                            overflow = 'scroll';
                        } else if (height < minHeight) {
                            height = minHeight;
                        }
                        height += boxOffset;
                        ta.style.overflowY = overflow;

                        if (original !== height) {
                            ta.style.height = height + 'px';
                            if (callback) {
                                options.callback.call(ta);
                            }
                        }

                        // This small timeout gives IE a chance to draw it's scrollbar
                        // before adjust can be run again (prevents an infinite loop).
                        setTimeout(function () {
                            active = false;
                        }, 1);
                    }
                }

                // mirror is a duplicate textarea located off-screen that
                // is automatically updated to contain the same text as the
                // original textarea.  mirror always has a height of 0.
                // This gives a cross-browser supported way getting the actual
                // height of the text, through the scrollTop property.
                while (i--) {
                    mirror.style[copyStyle[i]] = $ta.css(copyStyle[i]);
                }

                $('body').append(mirror);

                if (onpropertychange in ta) {
                    if (oninput in ta) {
                        // Detects IE9.  IE9 does not fire onpropertychange or oninput for deletions,
                        // so binding to onkeyup to catch most of those occassions.  There is no way that I
                        // know of to detect something like 'cut' in IE9.
                        ta[oninput] = ta.onkeyup = adjust;
                    } else {
                        // IE7 / IE8
                        ta[onpropertychange] = adjust;
                    }
                } else {
                    // Modern Browsers
                    ta[oninput] = adjust;

                    // The textarea overflow is now hidden.  But Chrome doesn't reflow the text after the scrollbars are removed.
                    // This is a hack to get Chrome to reflow it's text.
                    ta.value = '';
                    ta.value = value;
                }

                $(window).resize(adjust);

                // Allow for manual triggering if needed.
                $ta.bind('autosize', adjust);

                // Call adjust in case the textarea already contains text.
                adjust();
            });
        };
    } else {
        // Makes no changes for older browsers (FireFox3- and Safari4-)
        $.fn.autosize = function (callback) {
            return this;
        };
    }


}(jQuery));

function competency_explain(id) {
    $.post('/performance/competency_explain/' + id.toString() + '/');
    alert('Đã gửi yêu cầu thành công! CJS sẽ trả lời bạn trong thời gian sớm nhất qua email!');
    $(this).attr('disabled', 'disabled')
}


function attachFile(id1, id2) {
    $('#' + id1).bind('change', function () {
        var str = "";
        $val = $(this).val();
        valArray = $val.split('\\'),
            newVal = valArray[valArray.length - 1],
            $("#" + id2).text(newVal);
    }).change();
}


function dropdownAccount(id) {
    $("#" + id).show();
}

$(document).ajaxSend(function (event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e
            // relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie((typeof CSRF_COOKIE_NAME === 'undefined') ? 'csrftoken' : CSRF_COOKIE_NAME));
    }
});