$ ->

  # Toggle navigation search
  $( '#mobile-navigation, #mobile-search' ).click ->
    $( $( this ).data 'toggle' ).slideToggle 'fast', ->
      if ! $( this ).is ':visible'
        $( this ).css 'display': ''

  $( '#mobile-navigation' ).click ->
    $( '.burger', this ).toggleClass( 'active' )

  $( '#mobile-search' ).click ->
    $( $( this ).data 'toggle' ).find( 'input[type="text"]' ).focus()
    $( '.glass', this ).toggleClass( 'active' )
