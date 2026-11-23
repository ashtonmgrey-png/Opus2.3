
package com.opus.quest;

import android.app.Activity;
import android.os.Bundle;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.view.Gravity;
import android.widget.*;
import android.graphics.Typeface;

public class MainActivity extends Activity {

    SharedPreferences prefs;
    LinearLayout layout;

    EditText[] fields = new EditText[6];

    String[] names = {
        "Arm Length",
        "Push Force",
        "Velocity Multiplier",
        "Jump Multiplier",
        "Gravity Multiplier",
        "Velocity Cap"
    };

    String[] keys = {
        "arm", "push", "velocity",
        "jump", "gravity", "cap"
    };

    float[] defaults = {
        1f, 1f, 1f, 1f, 1f, 1f
    };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        prefs = getSharedPreferences("OpusProfile",
            MODE_PRIVATE);

        buildInterface();
    }

    void buildInterface() {

        ScrollView scroll = new ScrollView(this);

        layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(35, 35, 35, 35);
        layout.setBackgroundColor(Color.rgb(15, 18, 28));

        scroll.addView(layout);

        TextView title = new TextView(this);
        title.setText("OPUS PRELOAD");
        title.setTextColor(Color.WHITE);
        title.setTextSize(30);
        title.setTypeface(null, Typeface.BOLD);
        title.setGravity(Gravity.CENTER);
        layout.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("Gorilla Tag Locomotion Profile");
        subtitle.setTextColor(Color.LTGRAY);
        subtitle.setGravity(Gravity.CENTER);
        subtitle.setPadding(0, 10, 0, 30);
        layout.addView(subtitle);

        for (int i = 0; i < names.length; i++) {

            TextView label = new TextView(this);
            label.setText(names[i]);
            label.setTextColor(Color.WHITE);
            label.setTextSize(17);
            layout.addView(label);

            fields[i] = new EditText(this);
            fields[i].setSingleLine(true);
            fields[i].setTextColor(Color.WHITE);
            fields[i].setHintTextColor(Color.GRAY);
            fields[i].setHint("1.0");
            fields[i].setInputType(
                android.text.InputType.TYPE_CLASS_NUMBER |
                android.text.InputType.TYPE_NUMBER_FLAG_DECIMAL |
                android.text.InputType.TYPE_NUMBER_FLAG_SIGNED
            );

            float value = prefs.getFloat(keys[i], defaults[i]);
            fields[i].setText(String.valueOf(value));

            layout.addView(fields[i]);
        }

        Button prepare = new Button(this);
        prepare.setText("PREPARE PROFILE");
        layout.addView(prepare);

        Button reset = new Button(this);
        reset.setText("RESET DEFAULTS");
        layout.addView(reset);

        TextView status = new TextView(this);
        status.setTextColor(Color.GREEN);
        status.setTextSize(15);
        status.setGravity(Gravity.CENTER);
        status.setPadding(0, 25, 0, 0);
        layout.addView(status);

        prepare.setOnClickListener(v -> {

            try {
                SharedPreferences.Editor editor = prefs.edit();

                for (int i = 0; i < fields.length; i++) {
                    float value = Float.parseFloat(
                        fields[i].getText().toString()
                    );

                    if (value <= 0 || value > 10) {
                        throw new IllegalArgumentException(
                            "Values must be greater than 0 and at most 10."
                        );
                    }

                    editor.putFloat(keys[i], value);
                }

                editor.putBoolean("prepared", true);
                editor.apply();

                status.setText(
                    "PROFILE PREPARED AND SAVED!"
                );

            } catch (Exception e) {
                status.setText(
                    "Invalid setting. Check your values."
                );
            }
        });

        reset.setOnClickListener(v -> {

            for (int i = 0; i < fields.length; i++) {
                fields[i].setText("1.0");
            }

            prefs.edit().clear().apply();

            status.setText("DEFAULTS RESTORED");
        });

        setContentView(scroll);
    }
}
