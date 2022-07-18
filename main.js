$(document).ready(function () {
    // toggle setting item
    $('.setting-title .toggle-btn').on('click', function () {
        $(this).parents('.setting-title').next('.setting-detail').slideToggle();
        $(this).toggleClass('open');
    });

    // setting checkbox switch
    $('.form-switch .form-check-input').on('change', function () {
        if ($(this).prop('checked')) {
            $(this).parents('.setting-title').find('.toggle-btn').not('.open').trigger('click');
        } else {
            $(this).parents('.setting-title').find('.toggle-btn.open').trigger('click');
        }
    })

    //pointer Effect
    const outlineElement = $('#outline');

    $(document).on('click', (e) => {
        var mouseEffect = $('input[name="mouse_effect"]:checked').val();
        var isPointerEffect = $('#pointer_effect').prop('checked');
        if (isPointerEffect && mouseEffect != "outline") {
            handlePointerEffect(e)
        }
    })

    $(document).on('mousemove', (e) => {
        var isPointerEffect = $('#pointer_effect').prop('checked');
        var mouseEffect = $('input[name="mouse_effect"]:checked').val();
        var radiusMouseEffect = $('#radius-mouse-effect').val();
        if (isPointerEffect && mouseEffect === "outline") {
            outlineElement.css({
                "width": `${radiusMouseEffect}px`,
                "height": `${radiusMouseEffect}px`,
                "left": `${e.clientX - radiusMouseEffect / 2}px`,
                "top": `${e.clientY - radiusMouseEffect / 2}px`,
                "display": "inline-block",
            });
        }
    })

    $('input[name="mouse_effect"]').on('change', function (e) {
        if ($(this).val() != 'outline') {
            outlineElement.css({
                "display": "none",
            });
        }
    })

    function handlePointerEffect(e) {
        var radiusMouseEffect = $('#radius-mouse-effect').val();
        var mouseEffect = $('input[name="mouse_effect"]:checked').val();
        const pointerEffect = document.createElement("div");
        pointerEffect.className = mouseEffect;
        document.body.appendChild(pointerEffect);
        var animate = { opacity: 0.01 }
        if (mouseEffect == 'ripple') {
            animate = { ...animate, transform: `scale(${radiusMouseEffect / 4})` }
            pointerEffect.style.left = `${e.clientX}px`;
            pointerEffect.style.top = `${e.clientY}px`;
        } else {
            pointerEffect.style.width = `${radiusMouseEffect}px`;
            pointerEffect.style.height = `${radiusMouseEffect}px`;
            pointerEffect.style.left = `${e.clientX - radiusMouseEffect / 2}px`;
            pointerEffect.style.top = `${e.clientY - radiusMouseEffect / 2}px`;
        }
        pointerEffect.animate(animate, 400, true);
        setTimeout(() => document.body.removeChild(pointerEffect), 400)
    }

    // stopPropagation when click component:
    // const all = document.body.getElementsByTagName("*");
    // for (var i = 0;  i < all.length; ++i) {
    //   all[i].onclick = (event) => event.stopPropagation();
    // }

    // text preset setting
    var localStoragePresetTexts = localStorage.getItem('presetTexts');
    var presetTexts = localStoragePresetTexts ? JSON.parse(localStoragePresetTexts) : {};

    if (presetTexts) {
        for (var presetText in presetTexts) {
            $(`#${presetText}`).val(presetTexts[presetText]);
        }
    }

    $('.input-preset').on('change', function () {
        presetTexts[$(this).attr('id')] = $(this).val();
        localStorage.setItem('presetTexts', JSON.stringify(presetTexts));
    })

    jQuery.fn.extend({
        insertPresetValue: function (myValue) {
            return this.each(function (i) {
                if (document.selection) {
                    //For browsers like Internet Explorer
                    this.focus();
                    var sel = document.selection.createRange();
                    sel.text = myValue;
                    this.focus();
                }
                else if (this.selectionStart || this.selectionStart == '0') {
                    //For browsers like Firefox and Webkit based
                    var startPos = this.selectionStart;
                    var endPos = this.selectionEnd;
                    var scrollTop = this.scrollTop;
                    this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                    this.focus();
                    this.selectionStart = startPos + myValue.length;
                    this.selectionEnd = startPos + myValue.length;
                    this.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                    this.focus();
                }
            });
        }
    });

    // hotkey press
    $('input[type="text"], textarea').keydown(function (e) {
        var isTextPreset = $('#text_preset').prop('checked');
        const keyCodePresets = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57] //0,1,2,3,4,5,6,7,8,9
        var keyCode = e.which;
        var shifKey = e.shiftKey
        if (isTextPreset && (jQuery.inArray(keyCode, keyCodePresets) !== -1) && shifKey) {
            e.preventDefault();
            var inputPresetId = `input_preset_${keyCode}`;
            if (presetTexts && presetTexts[inputPresetId]) {
                var presetTextArr = `${presetTexts[inputPresetId]} `.split('');
                presetTextArr.forEach((letter, i) => {
                    setTimeout(() => {
                        $(this).insertPresetValue(letter);
                        return false;
                    }, 50 * i)
                })
            }
        }
    })
});
